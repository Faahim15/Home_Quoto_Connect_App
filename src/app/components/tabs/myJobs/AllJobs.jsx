import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useGetMyJobsQuery } from "../../../../redux/features/apiSlices/user/createJobSlices";

const ServiceCard = ({ item, showAddress }) => {
  const { city, state } = item?.location?.details || {};

  const priceFrom = item?.priceRange?.from;
  const priceTo = item?.priceRange?.to;
  const isPersonalized = item?.priceRange?.isPersonalized;

  const priceDisplay = isPersonalized
    ? "Personalized"
    : priceFrom && priceTo
      ? `$${priceFrom}-$${priceTo}`
      : "Price on request";

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/myJobs/allJobDetails",
          params: { serviceId: item._id },
        });
      }}
      style={{ width: "100%" }}
      className="bg-white border border-[#D4E0EB] rounded-xl shadow-sm overflow-hidden"
    >
      {/* ── Card Image ── */}
      <Image
        source={{ uri: item?.serviceCategory?.image?.url || null }}
        style={{ width: "100%", height: verticalScale(160) }}
        contentFit="cover"
        transition={300}
      />

      {/* ── Card Content ── */}
      <View className="px-3 pt-3 pb-3">
        {/* Title */}
        <Text
          className="text-gray-900 font-poppins-500medium text-base mb-[2%]"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.title || "N/A"}
        </Text>

        {/* Author */}
        <View className="flex-row items-center mb-[2%]">
          {item?.client?.profilePhoto?.url ? (
            <Image
              source={{ uri: item?.client?.profilePhoto?.url }}
              style={{ width: scale(16), height: scale(16), flexShrink: 0 }}
              className="bg-gray-300 rounded-full mr-[2%]"
            />
          ) : (
            <View
              style={{ width: scale(16), height: scale(16), flexShrink: 0 }}
              className="bg-gray-300 rounded-full mr-[2%] items-center justify-center"
            >
              <Ionicons name="person" size={10} color="#6B7280" />
            </View>
          )}
          <Text
            className="font-poppins-400regular text-sm flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            by{" "}
            <Text className="font-poppins-400regular text-[#319FCA] text-sm">
              {item?.client?.fullName || "N/A"}
            </Text>
          </Text>
        </View>

        {/* Service Type + Price */}
        <View className="flex-row w-full justify-between items-center mb-[2%]">
          <View className="flex-row items-center flex-1 mr-2">
            <Ionicons
              name="construct-outline"
              size={16}
              color="#6B7280"
              style={{ flexShrink: 0, marginRight: 4 }}
            />
            <Text
              className="font-poppins-400regular text-sm text-[#6B7280] flex-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {(item?.serviceCategory?.title || "N/A")
                .split(" ")
                .slice(0, 2)
                .join(" ")}
            </Text>
          </View>
          <Text
            className="font-poppins-400regular text-sm text-[#319FCA]"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ flexShrink: 0, maxWidth: scale(110) }}
          >
            {priceDisplay}
          </Text>
        </View>

        {/* Location + Time */}
        {showAddress && (
          <View className="flex-row items-center">
            <Ionicons
              name="location-outline"
              size={16}
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
        )}
      </View>
    </Pressable>
  );
};

export default function AllJobs({ showAddress = true }) {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useGetMyJobsQuery();

  const jobsData = data?.data?.jobs || data?.data || [];
  const displayData = jobsData.length > 0 ? jobsData : null;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing jobs:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View className="mt-[2%] justify-center px-[2%] items-start">
      {isLoading ? (
        <View
          className="w-full items-center justify-center"
          style={{ marginTop: verticalScale(100) }}
        >
          <ActivityIndicator size="large" color="#319FCA" />
          <Text className="mt-4 font-poppins-400regular text-gray-600">
            Loading jobs...
          </Text>
        </View>
      ) : error ? (
        <View
          className="w-full items-center justify-center"
          style={{ marginTop: verticalScale(100) }}
        >
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="mt-4 font-poppins-500medium text-red-500 text-base">
            Failed to load jobs
          </Text>
          <Text className="mt-2 font-poppins-400regular text-gray-600 text-center px-8">
            {error?.data?.message || error?.message || "Please try again later"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayData}
          renderItem={({ item }) => (
            <ServiceCard showAddress={showAddress} item={item} />
          )}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          horizontal={false}
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
              progressBackgroundColor="#ffffff"
            />
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: verticalScale(100),
              }}
            >
              <Ionicons name="briefcase-outline" size={48} color="#9CA3AF" />
              <Text className="mt-4 font-poppins-400regular text-gray-600">
                No jobs available
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
