import { View, Text, FlatList, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../../adaptive/Adaptiveness";
import { router } from "expo-router";

export default function ServiceProvider({ providerData }) {
  const renderStars = (rating) => {
    const numRating = parseFloat(rating || 0);
    return [1, 2, 3, 4, 5].map((star) => {
      const full = star <= Math.floor(numRating);
      const half =
        !full && star === Math.ceil(numRating) && numRating % 1 >= 0.5;
      return (
        <Ionicons
          key={star}
          name={full ? "star" : half ? "star-half" : "star-outline"}
          size={scale(11)}
          color="#F59E0B"
          style={{ marginRight: scale(1) }}
        />
      );
    });
  };

  const renderItem = ({ item }) => {
    const hasProfilePhoto = item?.profilePhoto?.url;
    const rating = item?.averageRating
      ? parseFloat(item.averageRating).toFixed(1)
      : null;

    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/services/providerDetails",
            params: { profileId: item?._id },
          })
        }
        className="bg-white rounded-2xl border border-[#E2EDF5] mr-3 overflow-hidden active:bg-[#F0F6FF]"
        style={{ width: scale(149) }}
      >
        {hasProfilePhoto ? (
          <Image
            source={{ uri: item.profilePhoto.url }}
            contentFit="cover"
            style={{ width: "100%", height: verticalScale(115) }}
            transition={300}
          />
        ) : (
          <View
            className="w-full bg-[#EBF3FA] items-center justify-center"
            style={{ height: verticalScale(115) }}
          >
            <Ionicons name="person" size={scale(40)} color="#A8C4D8" />
          </View>
        )}

        <View className="px-3 pt-2 pb-3 gap-y-1">
          <Text
            numberOfLines={1}
            className="font-poppins-semiBold text-[#1A2B3C]"
            style={{ fontSize: scale(12) }}
          >
            {item?.fullName?.split(" ").slice(0, 2).join(" ") || "N/A"}
          </Text>

          <Text
            numberOfLines={1}
            className="font-poppins-500medium text-[#7A92A8]"
            style={{ fontSize: scale(10) }}
          >
            {item?.businessName?.split(" ").slice(0, 2).join(" ") ||
              "No Designation"}
          </Text>

          <View className="flex-row items-center">
            {renderStars(rating)}
            <Text
              className="font-poppins-500medium text-[#F59E0B] ml-1"
              style={{ fontSize: scale(10) }}
            >
              {rating ?? "N/A"}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 mb-[2%] mt-[3%] mx-[6%]">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-poppins-semiBold text-base text-[#6B7280] ">
          Popular Service Providers
        </Text>
        <Pressable onPress={() => router.push("/services/providerViewAll")}>
          <Text className="font-poppins-semiBold text-base text-[#0054A5]">
            View all
          </Text>
        </Pressable>
      </View>

      <View className="flex-1">
        {!providerData || providerData.length === 0 ? (
          <View
            className="w-full items-center justify-center"
            style={{ height: verticalScale(150) }}
          >
            <Ionicons name="people-outline" size={scale(40)} color="#D1D5DB" />
            <Text
              className="font-poppins-500medium text-[#9CA3AF] mt-2"
              style={{ fontSize: scale(13) }}
            >
              No service providers found
            </Text>
          </View>
        ) : (
          <FlatList
            horizontal
            data={providerData}
            keyExtractor={(item, index) => item._id || index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: verticalScale(6) }}
          />
        )}
      </View>
    </View>
  );
}
