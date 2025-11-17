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
import { router } from "expo-router";
import { useState } from "react";
import { useGetAllJobsQuery } from "../../../../redux/features/apiSlices/user/createJobSlices";
import LoadingState from "../../ui/LoadingState";
import ErrorState from "../../ui/ErrorState";
import EmptyState from "../../ui/EmptyState";
import { statusColorMap } from "../../../util/colors";
import { getStatusLabel } from "../../../util/helper-function";
// Updated ServiceItem component with navigation
const ServiceItem = ({ item }) => {
  const acceptedQuote = item?.quotes?.find(
    (quote) => quote.status === "accepted" || quote.status === "updated"
  );

  const statusColor = statusColorMap?.[item?.status] ?? "#6B7280";
  const { fullName, averageRating, profilePhoto, totalReviews, _id } =
    acceptedQuote?.provider || {};

  const handleServicePress = () => {};

  return (
    <View className="mx-[4%] mb-[4%]">
      {/* Service Type Banner - Made clickable */}
      <Pressable
        onPress={handleServicePress}
        style={{
          borderTopLeftRadius: scale(8),
          borderTopRightRadius: scale(8),
        }}
        className="bg-gray-500 px-[3.5%] py-[3%] flex-row items-center justify-between"
      >
        <Text className="text-white font-poppins-400regular text-base">
          {item?.serviceCategory?.title || "N/A"}
        </Text>

        {/* <Ionicons name="arrow-forward" size={16} color="#fff" /> */}
      </Pressable>

      <View
        style={{
          borderBottomRightRadius: scale(8),
          borderBottomLeftRadius: scale(8),
        }}
        className="px-[4%] py-[4%] border border-[#DCDCDC] rounded-sm bg-white"
      >
        <View className="flex-row items-center gap-[4%]">
          {/* Profile Image */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/myJobs/serviceProfile",
                params: { showButtons: false, serviceId: item.id },
              })
            }
            className="w-16 h-16 mb-[20%] rounded-full bg-blue-500 items-center justify-center"
          >
            <Image
              source={{
                uri: profilePhoto?.url || null,
              }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Provider Details */}
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
                ({totalReviews > 1 ? "Reviews" : "Review" || "N/A"})
              </Text>
            </View>

            {/* Price and Time */}
            <View className="flex-row justify-between">
              <Text className="font-poppins-400regular text-base text-[#1F2937]">
                Price
              </Text>
              <Text className="text-[#F59E0B] text-base font-poppins-semiBold">
                {`$${acceptedQuote?.price}`}
              </Text>
            </View>
            <View className="flex-row justify-end mt-[3%]">
              <Text
                style={{ color: statusColor }}
                className="font-poppins-400regular text-sm"
              >
                {getStatusLabel(item?.status)}
              </Text>
            </View>
            {acceptedQuote?.isUpdated && (
              <View className="flex-row gap-[2%] justify-end mt-[3%]">
                <Ionicons name="warning" size={18} color="#FBBF24" />

                <Text className="font-poppins-400regular text-sm  text-[#1A73E8] ">
                  Sent an updated quote
                </Text>
              </View>
            )}
            <View className="flex-row gap-[4%] ">
              {/* {item.status === "Completed" && (
                <TouchableOpacity
                  onPress={() => router.push("/shared/reviewForm")} //navigation.navigate("ReviewFormScreen")
                  style={{ maxWidth: scale(120), height: verticalScale(30) }}
                  className="justify-center items-center  mt-[3%] rounded-md py-[2%] px-[2%] bg-[#00BFA5] "
                >
                  <Text className=" font-poppins-500medium text-[10px]  text-white text-sm font-semibold">
                    Give Feedback
                  </Text>
                </TouchableOpacity>
              )} */}
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/myJobs/progressQuote",
                    params: { jobId: item._id, quoteId: acceptedQuote?._id },
                  });
                }}
                style={{ width: scale(120), height: verticalScale(30) }}
                className="justify-center bg-[#0054A5] items-center  mt-[3%] rounded-md py-[2%] px-[2%]"
              >
                <Text className=" font-poppins-500medium text-[10px]  text-white text-sm font-semibold">
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

// Updated Services component with navigation prop
export default function QuoteProgress() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useGetAllJobsQuery();

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing services:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  // Extract jobs data with fallback
  const jobsData = data?.data?.jobs || [];
  const quoteData = jobsData.length > 0 ? jobsData : null;

  // Filter jobs that have quotes AND filter out jobs with any accepted quotes
  const filteredQuotes = Array.isArray(quoteData)
    ? quoteData.filter((job) => job.status === "in_progress")
    : [];

  // Handle empty state
  if (filteredQuotes.length === 0) {
    return <EmptyState />;
  }

  const renderServiceItem = ({ item }) => {
    return <ServiceItem item={item} />;
  };

  return (
    <View className="mb-[18%]">
      <FlatList
        data={filteredQuotes}
        renderItem={renderServiceItem}
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
            colors={["#175994"]} // Android
            tintColor="#175994" // iOS
            progressBackgroundColor="#ffffff" // Android
          />
        }
      />
    </View>
  );
}
