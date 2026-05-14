// TopServiceProvider.jsx
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../../adaptive/Adaptiveness";
import { router } from "expo-router";
import { useGetPopularProvidersQuery } from "../../../../../redux/features/apiSlices/user/createJobSlices";

const renderStars = (rating) => {
  const num = parseFloat(rating || 0);
  return [1, 2, 3, 4, 5].map((star) => {
    const full = star <= Math.floor(num);
    const half = !full && star === Math.ceil(num) && num % 1 >= 0.5;
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

const ServiceCard = ({ item }) => {
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
      className="bg-white rounded-2xl border border-[#E2EDF5] overflow-hidden active:bg-[#F0F6FF] "
      style={{
        width: (scale(375) - scale(375) * 0.12 - scale(12)) / 2,
        marginBottom: verticalScale(12),
        shadowColor: "#0054A5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      {hasProfilePhoto ? (
        <Image
          source={{ uri: item.profilePhoto.url }}
          contentFit="cover"
          style={{ width: "100%", height: verticalScale(130) }}
          transition={300}
        />
      ) : (
        <View
          className="w-full bg-[#EBF3FA] items-center justify-center"
          style={{ height: verticalScale(130) }}
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

export default function TopServiceProvider() {
  const { data, isLoading, error } = useGetPopularProvidersQuery();
  const providerData = data?.data?.providers || [];

  return (
    <View className="flex-1 mb-[2%] mt-[3%] mx-[6%]">
      {isLoading ? (
        <View
          className="flex-1 items-center justify-center"
          style={{ marginTop: verticalScale(50) }}
        >
          <ActivityIndicator size="large" color="#0054A5" />
          <Text className="mt-2 font-poppins-regular text-gray-500 text-sm">
            Loading Popular providers...
          </Text>
        </View>
      ) : error ? (
        <View
          className="flex-1 items-center justify-center"
          style={{ marginTop: verticalScale(50) }}
        >
          <Ionicons name="wifi-outline" size={scale(40)} color="#E2EDF5" />
          <Text className="font-poppins-semiBold text-red-400 mt-2">
            Failed to load providers
          </Text>
          <Text className="mt-1 font-poppins-regular text-gray-400 text-center text-xs">
            {error?.message || "Please try again later"}
          </Text>
        </View>
      ) : (
        <View className="flex-1 mt-[1.5%]">
          <FlatList
            data={providerData}
            renderItem={({ item }) => <ServiceCard item={item} />}
            keyExtractor={(item, idx) => item?._id || idx.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            ListEmptyComponent={
              <View
                className="flex-1 items-center justify-center"
                style={{ marginTop: verticalScale(50) }}
              >
                <Ionicons
                  name="people-outline"
                  size={scale(40)}
                  color="#D1D5DB"
                />
                <Text className="font-poppins-regular text-gray-400 mt-2 text-sm">
                  No providers available
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}
