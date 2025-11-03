import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../../adaptive/Adaptiveness";
import servicesData from "../../../data/shared/ServicesData";
import { router } from "expo-router";

const ServiceCard = ({ item }) => {
  console.log("items:", item?.photos[0]?.url);
  const { city, state } = item?.location?.details;
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/shared/serviceDetails",
          params: { serviceId: item._id, showButtons: false, showPrice: true },
        });
      }}
      style={{ width: scale(330), height: verticalScale(288) }}
      className="bg-white mr-[0.5%] border border-[#D4E0EB] justify-center items-start px-[4.5%] rounded-xl shadow-sm overflow-hidden"
    >
      {/* Card Image */}
      <View className="w-full">
        <Image
          source={{ uri: item?.photos[0]?.url || null }}
          className="rounded-lg"
          style={{ height: verticalScale(170) }}
          resizeMode="cover"
        />
      </View>

      {/* Card Content */}
      <View className="pt-[4%]">
        {/* Title */}
        <Text
          className="text-gray-900 font-poppins-500medium text-base mb-[2%]"
          numberOfLines={2}
        >
          {item?.title || "N/A"}
        </Text>

        {/* Author */}
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
            <Text className="font-poppins-400regular text-[#319FCA] text-sm">
              {item?.client?.fullName || "N/A"}
            </Text>
          </Text>
        </View>

        {/* Service Type */}
        <View className="flex-row w-full justify-between items-center mb-[2%]">
          <View className="flex-row gap-[2%] items-center">
            <Ionicons name="construct-outline" size={16} color="#6B7280" />
            <Text className="font-poppins-400regular text-sm text-[#6B7280]">
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
          >
            {item?.priceRange?.isPersonalized
              ? "Request a personalized..."
              : `$${item?.priceRange?.from || null}-$${item?.priceRange?.to || null}`}
          </Text>
        </View>

        {/* Location and Time */}

        <View className="flex-row items-center mb-[0%]">
          <Ionicons name="location-outline" size={16} color="#319FCA" />

          <Text className="font-poppins-400regular text-sm text-[#319FCA]">
            {city && state ? `${city}, ${state}` : "N/A"}
            <Text className="text-[#6B7280]"> | {item?.timeAgo || "N/A"}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ViewAllServiceCards({
  servicesData,
  isLoading,
  error,
}) {
  // Use API data if available, otherwise fallback to local data
  const displayData = servicesData || servicesData;

  return (
    <View className="mx-[6%] mt-[2%] justify-center items-start">
      {isLoading ? (
        <View
          className="w-full items-center justify-center"
          style={{ marginTop: verticalScale(100) }}
        >
          <ActivityIndicator size="large" color="#319FCA" />
          <Text className="mt-4 font-poppins-400regular text-gray-600">
            Loading services...
          </Text>
        </View>
      ) : error ? (
        <View
          className="w-full items-center justify-center"
          style={{ marginTop: verticalScale(100) }}
        >
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="mt-4 font-poppins-500medium text-red-500 text-base">
            Failed to load services
          </Text>
          <Text className="mt-2 font-poppins-400regular text-gray-600 text-center px-8">
            {error?.message || "Please try again later"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayData}
          renderItem={({ item }) => <ServiceCard item={item} />}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          numColumns={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: verticalScale(100),
            rowGap: verticalScale(12),
          }}
          ListEmptyComponent={
            <View
              className="w-full items-center justify-center"
              style={{ marginTop: verticalScale(100) }}
            >
              <Ionicons name="folder-open-outline" size={48} color="#9CA3AF" />
              <Text className="mt-4 font-poppins-400regular text-gray-600">
                No services available
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
