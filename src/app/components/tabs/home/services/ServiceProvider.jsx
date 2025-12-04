import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../../adaptive/Adaptiveness";
import { router } from "expo-router";

export default function ServiceProvider({ providerData }) {
  const renderItem = ({ item }) => {
    const hasProfilePhoto = item?.profilePhoto?.url;

    return (
      <View
        className="bg-white  border border-[#D4E0EB] flex-1 justify-center items-center rounded-lg mr-3"
        style={{ width: scale(149), height: verticalScale(210) }}
      >
        {hasProfilePhoto ? (
          <Image
            source={{ uri: item.profilePhoto.url }}
            resizeMode="cover"
            style={{
              width: scale(72),
              height: verticalScale(110),
            }}
          />
        ) : (
          <View
            className=" bg-gray-200 mt-[17%] rounded-full items-center justify-center"
            style={{
              width: scale(72),
              height: scale(72),
            }}
          >
            <Ionicons name="person" size={scale(40)} color="#9CA3AF" />
          </View>
        )}

        <View className="flex-1 pb-[10%] justify-end">
          <Text className="font-poppins-semiBold text-base text-[#565656]">
            {item?.fullName || "N/A"}
          </Text>
          <Text className="font-poppins-500medium text-xs text-[#565656] mb-[1%]">
            {item?.businessName?.split(" ").slice(0, 2).join(" ") ||
              "No Designation"}
          </Text>

          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text className="ml-1 font-poppins-500medium text-xs text-[#F59E0B]">
              {Number(item?.averageRating) / 10 || "N/A"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/services/providerDetails",
                params: { profileId: item?._id },
              })
            }
            style={{ width: scale(124), height: verticalScale(25) }}
            className="bg-[#0054A5] border border-[#0054A5] mt-[3%] rounded-md py-[3%] px-[3%]"
          >
            <Text className="text-white text-center text-[10px] font-poppins-500medium">
              Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 mb-[2%] mt-[3%] mx-[6%]">
      <View className="flex-row justify-between">
        <Text className="font-poppins-semiBold text-base text-[#6B7280]">
          Popular Service Providers
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/services/providerViewAll")}
        >
          <Text className="font-poppins-semiBold text-base text-[#18649F]">
            View all
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 mt-[1.5%]">
        <FlatList
          horizontal
          data={providerData}
          keyExtractor={(item, index) => item._id || index.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}
