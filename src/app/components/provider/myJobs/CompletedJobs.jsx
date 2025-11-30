import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { cancelledJobData } from "../../data/provider/MyJobsData";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useGetAllQuotesQuery } from "../../../../redux/features/apiSlices/quote/quoteApiSlice";
import { statusColorMap } from "../../../util/colors";
import { getStatusLabel } from "../../../util/helper-function";
import CustomTitle from "../../shared/CustomTitle";
import CustomButton from "../../tabs/home/services/provider/details/CustomButton";
const ServiceCard = ({ item }) => {
  const { profilePhoto, fullName } = item?.job?.client || {};
  const { city, state } = item?.job?.location?.details || {};
  const statusColor = statusColorMap?.[item?.status] ?? "#6B7280";
  const handlePress = useCallback(() => {
    router.push({
      pathname: "/provider/myJobs/completedJobs",
      params: { quoteId: item?._id, jobId: item?.job?._id, showButtons: "yes" },
    });
  }, [item]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ width: scale(327), height: "full" }}
      className="bg-white pb-[2%] mr-[0.5%] flex-col justify-center  border border-[#D4E0EB] px-[4.5%]  rounded-xl shadow-sm overflow-hidden"
    >
      <View className="flex-row mt-[2%] ">
        {/* User Image */}
        <View className="">
          <Image
            source={{ uri: profilePhoto?.url || undefined }}
            style={{ width: scale(48), height: verticalScale(48) }}
            className="mt-[12%] bg-gray-300 rounded-full mr-[2%]"
          />
        </View>

        {/* Card Content */}
        <View className=" ">
          {/* Title */}
          <Text
            className="text-gray-900 font-poppins-500medium text-base mt-[2%] "
            numberOfLines={2}
          >
            {item?.job?.title || "N/A"}
          </Text>

          {/* Author */}
          <View className="flex-row items-center mt-[2%]">
            <Text className="font-poppins-400regular text-sm">
              by{" "}
              <Text className="font-poppins-400regular text-[#319FCA] text-sm ">
                {fullName || "N/A"}
              </Text>
            </Text>
          </View>

          {/* Service Type */}
          <View className="flex-row gap-[2%] items-center mt-[2%]">
            <Ionicons name="construct-outline" size={16} color="#6B7280" />
            <Text className="font-poppins-400regular text-sm text-[#6B7280] ">
              {item?.job?.serviceCategory?.title || "N/A"}
            </Text>
          </View>

          {/* Location and Time */}
          <View className="flex-row items-center mt-[2%]">
            <Ionicons name="location-outline" size={16} color="#319FCA" />
            <Text className="text-gray-500 text-sm ml-[1%]"></Text>

            <Text className="font-poppins-400regular text-sm text-[#319FCA] ">
              {city && state ? `${city}, ${state}` : "N/A"}{" "}
              <Text className="text-[#6B7280]">| {item?.timeAgo}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Price section */}

      <View className="flex-row mt-[2%] justify-between">
        <Text className="font-poppins-400regular text-base text-[#1F2937] ">
          Price
        </Text>
        <Text className="font-poppins-semiBold text-base text-[#F59E0B] ">
          {`$${item?.price}` || "N/A"}
        </Text>
      </View>
      {/* Status section */}

      <View className="flex-row mt-[2%] justify-between">
        <Text className="font-poppins-400regular text-base text-[#1F2937] ">
          status
        </Text>
        <Text
          style={{ color: statusColor }}
          className={`font-poppins-400regular text-base`}
        >
          {getStatusLabel(item?.job?.status || "N/A")}
        </Text>
      </View>

      {/* Job and payment confirmation section */}
      <View className="mb-[2%]">
        <CustomButton
          onPress={() =>
            router.push({
              pathname: "provider/reviewForm",
              params: { jobId: item?.job?._id },
            })
          }
          title="Give Feedback"
        />
      </View>
    </TouchableOpacity>
  );
};

export default function CompletedJobs() {
  const { data, isLoading, error, refetch } = useGetAllQuotesQuery();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh when screen focuses
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
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

        <TouchableOpacity
          onPress={refetch}
          className="mt-6 bg-[#175994] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-500medium text-white text-base">
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  // ------------------------------------------
  // Empty State
  // ------------------------------------------
  const completedJobs =
    data?.data?.quotes?.filter((q) => q?.job?.status === "completed") || [];

  console.log("compleded", completedJobs[0]?.job?.status);

  if (completedJobs.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9] px-6">
        <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />

        <Text className="font-poppins-600semiBold text-lg text-gray-900 mt-4 text-center">
          No Quotes Available
        </Text>

        <Text className="font-poppins-400regular text-sm text-gray-600 mt-2 text-center">
          You don't have any quote requests at the moment.
        </Text>

        <TouchableOpacity
          onPress={refetch}
          className="mt-6 bg-[#175994] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-500medium text-white text-base">
            Refresh
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="justify-center items-center  bg-[#f9f9f9] mt-[4%]">
      <FlatList
        data={completedJobs}
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
