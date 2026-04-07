import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../../../adaptive/Adaptiveness";
import { router } from "expo-router";
import { useState } from "react";

const ServiceCard = ({ item }) => {
  const { fullName } = item?.client;
  const { city, state } = item?.location?.details || {};

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/shared/serviceDetails",
          params: { serviceId: item?._id, showButtons: true, showPrice: true },
        });
      }}
      style={{ width: scale(330), height: verticalScale(288) }}
      className="bg-white mr-[0.5%] border border-[#D4E0EB] justify-center items-start px-[4.5%] rounded-xl shadow-sm overflow-hidden"
    >
      <View className="w-full">
        <Image
          source={{
            uri: item?.serviceCategory?.image?.url || null,
          }}
          className="rounded-xl"
          style={{ height: verticalScale(170) }}
          resizeMode="cover"
        />
      </View>

      <View className="pt-[4%]">
        <Text
          className="text-gray-900 font-poppins-500medium text-base mb-[2%]"
          numberOfLines={2}
        >
          {item?.title || "N/A"}
        </Text>

        <View className="flex-row items-center mb-[2%]">
          <Image
            source={{
              uri:
                item?.client?.profilePhoto?.url ||
                "https://via.placeholder.com/300",
            }}
            style={{ width: scale(16), height: verticalScale(16) }}
            className="bg-gray-300 rounded-full mr-[2%]"
          />
          <Text className="font-poppins-400regular text-sm">
            by{" "}
            <Text className="font-poppins-400regular text-[#319FCA] text-sm ">
              {fullName || "N/A"}
            </Text>
          </Text>
        </View>

        <View className="flex-row w-full justify-between items-center mb-[2%]">
          <View className="flex-row gap-[2%] items-center">
            <Ionicons name="construct-outline" size={16} color="#6B7280" />
            <Text className="font-poppins-400regular text-sm text-[#6B7280] ">
              {(item?.serviceCategory?.title || "N/A")
                .split(" ")
                .slice(0, 2)
                .join(" ")}
            </Text>
          </View>

          <Text
            className="font-poppins-400regular text-sm text-[#319FCA]"
            numberOfLines={1}
          >
            {item?.priceRange?.isPersonalized
              ? "Request a personalized..."
              : `$${item?.priceRange?.from || null}-$${item?.priceRange?.to || null}`}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#319FCA" />
          <Text className="font-poppins-400regular text-sm text-[#319FCA] ml-[1%]">
            {city && state ? `${city}, ${state}` : "N/A"}
            <Text className="text-[#6B7280]"> | {item?.timeAgo || "N/A"}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
