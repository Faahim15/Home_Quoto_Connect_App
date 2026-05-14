import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../../adaptive/Adaptiveness";
import { router } from "expo-router";
import { Image } from "expo-image";

const ServiceCard = ({ item, showButtons }) => {
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
          params: {
            serviceId: item._id,
            showButtons: showButtons,
            showPrice: true,
          },
        });
      }}
      className="bg-white border border-[#D4E0EB] rounded-xl shadow-sm overflow-hidden"
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
            <View
              style={{ width: scale(16), height: scale(16), flexShrink: 0 }}
              className="bg-gray-300 rounded-full mr-[2%] items-center justify-center"
            >
              <Ionicons name="person" size={10} color="#6B7280" />
            </View>
          )}
          <Text
            className="font-poppins-400regular text-sm flex-1 ml-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            by{" "}
            <Text className="font-poppins-400regular text-[#319FCA] text-sm">
              {item?.client?.fullName || "N/A"}
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

export default function ViewAllServiceCards({
  servicesData,
  isLoading,
  error,
  refreshing,
  onRefresh,
  showButtons,
}) {
  const displayData = servicesData || [];

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
          renderItem={({ item }) => (
            <ServiceCard showButtons={showButtons} item={item} />
          )}
          keyExtractor={(item, index) => item?.id || index.toString()}
          numColumns={1}
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
            <View className="flex-1 mt-[50%] ml-[30%] items-center justify-center">
              <Ionicons name="folder-open-outline" size={48} color="#9CA3AF" />
              <Text className="mt-4 font-poppins-400regular text-gray-600 text-center">
                No services available
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
