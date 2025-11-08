import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const { width } = Dimensions.get("window");
import { scale, verticalScale } from "../../../adaptive/Adaptiveness";
import { ProvidersCategories } from "../../../data/shared/Categories";
const cardWidth = width * 0.45;
import { router } from "expo-router";
import { useGetPopularProvidersQuery } from "../../../../../redux/features/apiSlices/user/createJobSlices";
const ServiceCard = ({ item }) => {
  return (
    <View
      className="bg-white border border-[#D4E0EB] flex-1 justify-center items-center rounded-lg  mr-3"
      style={{ width: scale(149), height: verticalScale(210) }}
    >
      <Image
        source={{ uri: item?.profilePhoto?.url || null }}
        resizeMode="cover"
        style={{
          width: scale(72),
          height: verticalScale(110),
        }}
      />
      <View className="flex-1 pb-[10%] justify-end ">
        <Text className=" font-poppins-semiBold text-base text-[#565656]">
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
          {/* <Text className="ml-auto font-poppins-400regular text-base text-[#18649F]">
            {item.price}
          </Text> */}
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

export default function TopServiceProvider() {
  const { data, isLoading, error } = useGetPopularProvidersQuery();
  const providerData = data?.data?.providers || [];
  return (
    <View className="flex-1 mb-[2%] mt-[3%]  mx-[6%] ">
      {isLoading ? (
        <View
          className="flex-1 items-center justify-center"
          style={{ marginTop: verticalScale(50) }}
        >
          <ActivityIndicator size="large" color="#0066CC" />
          <Text className="mt-2 font-poppins-regular text-gray-600">
            Loading Popular providers...
          </Text>
        </View>
      ) : error ? (
        <View
          className="flex-1 items-center justify-center"
          style={{ marginTop: verticalScale(50) }}
        >
          <Text className="font-poppins-semiBold text-red-500">
            Failed to load popular providers.
          </Text>
          <Text className="mt-2 font-poppins-regular text-gray-600 text-center">
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
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: verticalScale(12),
            }}
            ListEmptyComponent={
              <View
                className="flex-1 items-center justify-center"
                style={{ marginTop: verticalScale(50) }}
              >
                <Text className="font-poppins-regular text-gray-600">
                  No services available
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}
