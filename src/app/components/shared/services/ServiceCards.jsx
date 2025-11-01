import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import servicesData from "../../data/shared/ServicesData";
import { router } from "expo-router";
const ServiceCard = ({ item, showAddress, showPrice }) => {
  const { url } = item.serviceCategory?.image;
  const { fullName } = item.client;
  const { city, state } = item?.location?.details;
  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/shared/serviceDetails",
          params: { serviceId: item.id, showPrice: showPrice },
        });
      }}
      style={{ width: scale(330), height: verticalScale(288) }}
      className="bg-white mr-[0.5%]  border border-[#D4E0EB] justify-center items-start px-[3%]  rounded-xl shadow-sm overflow-hidden"
    >
      {/* Card Image */}
      <View className="w-full">
        <Image
          source={{
            uri: url || "https://via.placeholder.com/300",
          }}
          className="rounded-xl"
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
            className=" bg-gray-300 rounded-full mr-[2%]"
          />
          <Text className="font-poppins-400regular text-sm">
            by{" "}
            <Text className="font-poppins-400regular text-[#319FCA] text-sm ">
              {fullName || "N/A"}
            </Text>
          </Text>
        </View>

        {/* Service Type and Price */}
        <View className="flex-row w-full justify-between items-center mb-[2%]">
          <View className="flex-row gap-[2%] items-center">
            <Ionicons name="construct-outline" size={16} color="#6B7280" />
            <Text className="font-poppins-400regular text-sm text-[#6B7280] ">
              {" "}
              {item?.serviceCategory?.title || "N/A"}
            </Text>
          </View>
          {showAddress && (
            <Text
              className="font-poppins-400regular text-sm text-[#319FCA]"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.priceRange?.isPersonalized
                ? "Request a personalized..."
                : `$${item?.priceRange?.from || null}-${item?.priceRange?.to || null}`}
            </Text>
          )}
        </View>

        {/* Location and Time */}
        {showAddress && (
          <View className="flex-row items-center mb-[0%]">
            <Ionicons name="location-outline" size={16} color="#319FCA" />

            <Text className="font-poppins-400regular text-sm text-[#319FCA]">
              {city && state ? `${city}, ${state}` : "N/A"}
              <Text className="text-[#6B7280]">
                {" "}
                | {item?.timeAgo || "N/A"}
              </Text>
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function ServiceCards({ jobs, showPrice = false, showAddress }) {
  // console.log("todays job:", jobs);
  const jobData = jobs || servicesData;
  return (
    <View className="mt-[2%] justify-center mx-[6%]  items-start   ">
      <FlatList
        data={jobData}
        renderItem={({ item }) => (
          <ServiceCard
            showPrice={showPrice}
            showAddress={showAddress}
            item={item}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: scale(80),
        }}
      />
    </View>
  );
}
