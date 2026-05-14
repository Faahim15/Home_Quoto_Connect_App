import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { cancelledJobData } from "../../data/provider/MyJobsData";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useGetAllQuotesQuery } from "../../../../redux/features/apiSlices/quote/quoteApiSlice";
import { statusColorMap } from "../../../util/colors";
import { getStatusLabel } from "../../../util/helper-function";
import { Image } from "expo-image";
const ServiceCard = ({ item }) => {
  const { profilePhoto, fullName } = item?.job?.client || {};
  const { city, state } = item?.job?.location?.details || {};
  const statusColor = statusColorMap?.[item?.status] ?? "#6B7280";

  const handlePress = useCallback(() => {
    router.push({
      pathname: "/provider/myJobs/cancelJobs",
      params: { quoteId: item?._id, jobId: item?.job?._id, showButtons: "yes" },
    });
  }, [item]);

  return (
    <Pressable
      onPress={handlePress}
      style={{ width: scale(327) }}
      className="bg-white mr-[0.5%] border border-[#D4E0EB] px-[4.5%] py-3 rounded-xl shadow-sm overflow-hidden"
    >
      {/* Top row: avatar + title + author */}
      <View className="flex-row items-center mb-2">
        {profilePhoto?.url ? (
          <Image
            source={{ uri: profilePhoto.url }}
            style={{
              width: scale(46),
              height: scale(46),
              borderRadius: scale(23),
              flexShrink: 0,
            }}
            contentFit="cover"
            className="bg-gray-200"
          />
        ) : (
          <View
            style={{
              width: scale(46),
              height: scale(46),
              borderRadius: scale(23),
              flexShrink: 0,
            }}
            className="bg-gray-200 items-center justify-center"
          >
            <Ionicons name="person" size={scale(22)} color="#9CA3AF" />
          </View>
        )}

        <View className="flex-1 ml-3">
          <Text
            className="text-gray-900 font-poppins-500medium text-base"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item?.job?.title || "N/A"}
          </Text>
          <Text
            className="font-poppins-400regular text-sm flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            by{" "}
            <Text className="font-poppins-400regular text-[#319FCA] text-sm">
              {fullName || "N/A"}
            </Text>
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="border-t border-[#F0F4F8] mb-2" />

      {/* Service Type */}
      <View className="flex-row items-center mb-2">
        <Ionicons
          name="construct-outline"
          size={15}
          color="#6B7280"
          style={{ flexShrink: 0, marginRight: 6 }}
        />
        <Text
          className="font-poppins-400regular text-sm text-[#6B7280] flex-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.job?.serviceCategory?.title || "N/A"}
        </Text>
      </View>

      {/* Location and Time */}
      <View className="flex-row items-center mb-2">
        <Ionicons
          name="location-outline"
          size={15}
          color="#319FCA"
          style={{ flexShrink: 0 }}
        />
        <Text
          className="font-poppins-400regular text-sm text-[#319FCA] flex-1 ml-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {city && state ? `${city}, ${state}` : "Location not specified"}
          <Text className="text-[#6B7280]">
            {" | "}
            {item?.timeAgo || "Just now"}
          </Text>
        </Text>
      </View>

      {/* Divider */}
      <View className="border-t border-[#F0F4F8] mb-2" />

      {/* Status */}
      <View className="flex-row justify-between items-center">
        <Text className="font-poppins-400regular text-base text-[#1F2937]">
          status
        </Text>
        <Text
          style={{ color: statusColor }}
          className="font-poppins-400regular text-base"
        >
          {getStatusLabel(item?.status || "N/A")}
        </Text>
      </View>
    </Pressable>
  );
};

export default function CancelledJobs() {
  const { data, isLoading, error, refetch } = useGetAllQuotesQuery();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh when screen focuses
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Pull to Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // ------------------------------------------
  // Loading State
  // ------------------------------------------
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9]">
        <ActivityIndicator size="large" color="#175994" />
        <Text className="font-poppins-400regular text-sm text-gray-600 mt-4">
          Loading quotes...
        </Text>
      </View>
    );
  }

  // ------------------------------------------
  // Error State
  // ------------------------------------------
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9] px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="font-poppins-600semiBold text-lg text-gray-900 mt-4 text-center">
          Unable to Load Quotes
        </Text>
        <Text className="font-poppins-400regular text-sm text-gray-600 mt-2 text-center">
          {error?.message || "Something went wrong. Please try again."}
        </Text>

        <Pressable
          onPress={refetch}
          className="mt-6 bg-[#175994] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-500medium text-white text-base">
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }
  // ------------------------------------------
  // Empty State
  // ------------------------------------------
  const cancelledJobs =
    data?.data?.quotes?.filter((q) => q?.status === "cancelled") || [];

  // cancelledJobs.forEach((job) => {
  //   // console.log("job status:", job?.status);

  //   job?.job?.quotes?.forEach((quote) => {
  //     console.log("quote status:", quote?.status);
  //   });
  // });

  if (cancelledJobs.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9] px-6">
        <Ionicons name="close-circle-outline" size={64} color="#9CA3AF" />

        <Text className="font-poppins-600semiBold text-lg text-gray-900 mt-4 text-center">
          No Cancelled Quotes
        </Text>

        <Text className="font-poppins-400regular text-sm text-gray-600 mt-2 text-center">
          You don't have any cancelled quotes at the moment.
        </Text>

        <Pressable
          onPress={refetch}
          className="mt-6 bg-[#175994] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-500medium text-white text-base">
            Refresh
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="justify-center items-center  bg-[#f9f9f9] mt-[4%]">
      <FlatList
        data={cancelledJobs}
        renderItem={({ item }) => <ServiceCard item={item} />}
        keyExtractor={(item, idx) => item._id || idx.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(100),
          rowGap: verticalScale(12),
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#175994"]}
            tintColor="#175994"
          />
        }
      />
    </View>
  );
}
