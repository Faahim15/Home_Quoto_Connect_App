import { View, Text, FlatList, RefreshControl, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../../../adaptive/Adaptiveness";
import { router } from "expo-router";
import { useState } from "react";
import { Image } from "expo-image";

const ServiceCard = ({ item }) => {
  const { fullName } = item?.client;
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
          pathname: "/shared/serviceDetails",
          params: { serviceId: item?._id, showButtons: true, showPrice: true },
        });
      }}
      style={{ width: scale(300) }}
      className="bg-white mr-3 border border-[#D4E0EB] rounded-xl shadow-sm overflow-hidden"
    >
      {/* Image — full width, edge to edge */}
      <Image
        source={{ uri: item?.serviceCategory?.image?.url || null }}
        style={{ width: "100%", height: verticalScale(160) }}
        contentFit="cover"
        transition={300}
      />

      {/* Content */}
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
            <Ionicons
              name="person-circle-outline"
              size={18}
              color="#319FCA"
              style={{ flexShrink: 0 }}
            />
          )}
          <Text
            className="font-poppins-400regular text-sm flex-1 ml-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            by{" "}
            <Text className="font-poppins-400regular text-[#319FCA] text-sm">
              {fullName || "N/A"}
            </Text>
          </Text>
        </View>

        {/* Service Type and Price */}
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

        {/* Location and Time */}
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
      </View>
    </Pressable>
  );
};

export default function ShowAllServiceCards({ jobs, horizontal }) {
  const allJobs = jobs?.filter((job) => !job.isDirectBooking);
  const isEmpty = !allJobs || allJobs.length === 0;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await new Promise((resolve) => setTimeout(resolve, 1200));
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View className="mx-[6%] mt-[2%] justify-center items-start">
      {isEmpty ? (
        <Text className="text-gray-500 font-poppins-400regular text-base">
          No services available at the moment.
        </Text>
      ) : (
        <FlatList
          data={allJobs}
          renderItem={({ item }) => <ServiceCard item={item} />}
          keyExtractor={(item, index) => item._id || index.toString()}
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            horizontal
              ? { paddingRight: verticalScale(100) }
              : { rowGap: verticalScale(12), paddingBottom: verticalScale(180) }
          }
          refreshControl={
            !horizontal ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#175994"]}
                tintColor="#175994"
              />
            ) : undefined
          }
        />
      )}
    </View>
  );
}
