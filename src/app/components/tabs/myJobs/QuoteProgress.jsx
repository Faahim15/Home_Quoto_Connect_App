import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { useGetMyJobsQuery } from "../../../../redux/features/apiSlices/user/createJobSlices";
import LoadingState from "../../ui/LoadingState";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";
import { statusColorMap } from "../../../util/colors";
import { getStatusLabel } from "../../../util/helper-function";

// ----------------------
// Service Item Component
// ----------------------
const ServiceItem = ({ item }) => {
  const acceptedQuote =
    item?.quotes?.find((q) => q.status === "updated") ||
    item?.quotes?.find((q) => q.status === "accepted");

  // ⛔ DO NOT RENDER ANYTHING IF NO ACCEPTED/UPDATED QUOTE
  if (
    !acceptedQuote ||
    acceptedQuote?.description === "Direct booking - quote to be provided"
  )
    return null;

  const statusColor = statusColorMap?.[item?.status] ?? "#6B7280";
  const { fullName, averageRating, profilePhoto, totalReviews, _id } =
    acceptedQuote?.provider || {};

  // console.log("accepted", acceptedQuote?.description);

  return (
    <View className="mx-[4%] mb-[4%]">
      {/* Header */}
      <Pressable
        style={{
          borderTopLeftRadius: scale(8),
          borderTopRightRadius: scale(8),
        }}
        className="bg-gray-500 px-[3.5%] py-[3%] flex-row items-center justify-between"
      >
        <Text className="text-white font-poppins-400regular text-base">
          {item?.serviceCategory?.title || "N/A"}
        </Text>
      </Pressable>

      {/* Body */}
      <View
        style={{
          borderBottomRightRadius: scale(8),
          borderBottomLeftRadius: scale(8),
        }}
        className="px-[4%] py-[4%] border border-[#DCDCDC] rounded-sm bg-white"
      >
        <View className="flex-row items-center gap-[4%]">
          {/* Provider Image */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/myJobs/serviceProfile",
                params: { showButtons: false, profileId: _id },
              })
            }
            className="w-16 h-16 mb-[20%] rounded-full bg-blue-500 items-center justify-center"
          >
            <Image
              source={{ uri: profilePhoto?.url || null }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Details */}
          <View className="flex-1">
            <Text className="font-poppins-500medium text-xl text-gray-800 mb-1">
              {fullName || "N/A"}
            </Text>

            {/* Rating */}
            <View className="flex-row items-center mb-[2%]">
              <Text className="text-[#F59E0B] font-poppins-400regular text-xs mr-1">
                ★ {Number(averageRating) / 10 || "N/A"}
              </Text>
              <Text className="font-poppins-400regular text-[#18649F] text-xs">
                ({totalReviews > 1 ? "Reviews" : "Review"})
              </Text>
            </View>

            {/* Price */}
            <View className="flex-row justify-between">
              <Text className="font-poppins-400regular text-base text-[#1F2937]">
                Price
              </Text>
              <Text className="text-[#F59E0B] text-base font-poppins-semiBold">
                {`$${acceptedQuote?.price}`}
              </Text>
            </View>

            {/* Status */}
            <View className="flex-row justify-end mt-[3%]">
              <Text
                style={{ color: statusColor }}
                className="font-poppins-400regular text-sm"
              >
                {getStatusLabel(item?.status)}
              </Text>
            </View>

            {/* Updated Quote Warning */}
            {acceptedQuote?.status === "updated" && (
              <View className="flex-row gap-[2%] justify-end mt-[3%]">
                <Ionicons name="warning" size={18} color="#FBBF24" />
                <Text className="font-poppins-400regular text-sm text-[#1A73E8]">
                  Sent an updated quote
                </Text>
              </View>
            )}

            {/* Buttons */}
            <View className="flex-row gap-[4%]">
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/myJobs/progressQuote",
                    params: { jobId: item._id, quoteId: acceptedQuote?._id },
                  });
                }}
                style={{ width: scale(120), height: verticalScale(30) }}
                className="justify-center bg-[#0054A5] items-center mt-[3%] rounded-md py-[2%] px-[2%]"
              >
                <Text className="font-poppins-500medium text-white text-[10px]">
                  Details
                </Text>
              </TouchableOpacity>

              <View className="flex-1 flex-row pt-1 justify-end">
                <Text className="text-gray-500 text-sm">
                  {acceptedQuote?.timeAgo || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// ----------------------
// MAIN SCREEN
// ----------------------
export default function QuoteProgress() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useGetMyJobsQuery();

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const jobsData = data?.data?.jobs || [];

  // Filter only jobs that are in progress
  const inProgressJobs = jobsData.filter((job) => job.status === "in_progress");

  // Filter only those that have an accepted or updated quote
  const filteredQuotes = inProgressJobs.filter((job) => {
    const hasAccepted = job?.quotes?.some(
      (q) => q.status === "accepted" || q.status === "updated"
    );
    return hasAccepted;
  });

  if (filteredQuotes.length === 0) {
    return <EmptyState />;
  }

  return (
    <View className="mb-[18%]">
      <FlatList
        data={filteredQuotes}
        renderItem={({ item }) => <ServiceItem item={item} />}
        keyExtractor={(item, index) => item?._id || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: scale(16),
          paddingBottom: scale(20),
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#175994"]}
            tintColor="#175994"
            progressBackgroundColor="#ffffff"
          />
        }
      />
    </View>
  );
}
