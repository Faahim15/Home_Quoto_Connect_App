import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { scale, verticalScale } from "../../../adaptive/Adaptiveness";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useGetAllJobsQuery } from "../../../../../redux/features/apiSlices/user/createJobSlices";
import LoadingState from "../../../ui/LoadingState";
import ErrorState from "../../../ui/ErrorState";
import EmptyState from "../../../ui/EmptyState";
// Updated ServiceItem component with navigation
const ServiceItem = ({ item }) => {
  const acceptedQuote = item?.quotes?.find((q) => q.status === "accepted");
  const { fullName, averageRating, profilePhoto, totalReviews, _id } =
    acceptedQuote?.provider || {};
  return (
    <View className="mx-[4%] mb-[4%]">
      {/* Service Type Banner - Made clickable */}
      <Pressable
        style={{
          borderTopLeftRadius: scale(8),
          borderTopRightRadius: scale(8),
        }}
        className="px-[3.5%] py-[3%] flex-row bg-gray-500 items-center justify-between"
      >
        <Text className="text-white font-poppins-400regular text-base">
          {item?.serviceCategory?.title || "N/A"}
        </Text>
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
                params: { showButtons: false, providerId: _id },
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

          {/* Provider Details */}
          <View className="flex-1">
            <View className="flex-row justify-between items-center ">
              <Text className="font-poppins-500medium text-xl text-gray-800 mb-1">
                {fullName || "N/A"}
              </Text>
              <View className="">
                <Text
                  // style={{ color: statusColor }}
                  className="font-poppins-400regular rounded p-[1%] text-white text-xs bg-[#D32F2F]"
                >
                  Cancelled
                </Text>
              </View>
            </View>
            {/* Rating */}
            <View className="flex-row items-center mb-[2%]">
              <Text className="text-[#F59E0B] font-poppins-400regular text-xs mr-1">
                ★ {Number(averageRating) / 10 || "N/A"}
              </Text>
              <Text className="font-poppins-400regular text-[#18649F] text-xs">
                ({totalReviews > 1 ? "Reviews" : "Review"})
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

            <View className="flex-row gap-[4%] ">
              <TouchableOpacity
                onPress={() => router.push("/shared/reviewForm")} //navigation.navigate("ReviewFormScreen")
                style={{ maxWidth: scale(120), height: verticalScale(30) }}
                className="justify-center items-center  mt-[3%] rounded-md py-[2%] px-[2%] bg-[#00BFA5] "
              >
                <Text className=" font-poppins-500medium text-[10px]  text-white text-sm font-semibold">
                  Give Feedback
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/myJobs/cancelledQuote",
                    params: { jobId: item._id, quoteId: acceptedQuote?._id },
                  });
                }}
                style={{ width: scale(120), height: verticalScale(30) }}
                className="justify-center items-center  mt-[3%] rounded-md py-[2%] px-[2%] bg-[#0054A5]"
              >
                <Text className="  text-[10px]  text-white text-sm font-poppins-semiBold">
                  Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Updated Services component with navigation prop
export default function CancelledQuote() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useGetAllJobsQuery();

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
  const cancelledJobs = jobsData.filter((job) => job.status === "cancelled");

  if (cancelledJobs.length === 0) {
    return <EmptyState />;
  }
  const renderServiceItem = ({ item }) => {
    return <ServiceItem item={item} />;
  };

  return (
    <View className="mb-[18%]">
      <FlatList
        data={cancelledJobs}
        renderItem={renderServiceItem}
        keyExtractor={(item, index) => item._id.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: scale(16),
          paddingBottom: scale(20),
        }}
      />
    </View>
  );
}
