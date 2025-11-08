import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import popularSeviceData from "../components/data/shared/PopularServiceData";
import CustomHeader from "../components/tabs/home/services/CustomHeader";
import { useGetServiceCategoriesQuery } from "../../redux/features/apiSlices/user/createJobSlices";

const screenWidth = Dimensions.get("window").width;
const horizontalMargin = screenWidth * 0.12; // 6% left + 6% right
const cardGap = scale(16); // gap between cards
const numColumns = 3;
const cardWidth =
  (screenWidth - horizontalMargin - cardGap * (numColumns - 1)) / numColumns;

const ServiceItem = ({ item }) => {
  return (
    <Pressable
      onPress={() => {}}
      style={[
        {
          width: cardWidth,
          height: verticalScale(110),
          marginBottom: scale(16),
        },
      ]}
      className="bg-white border rounded-lg border-[#D4E0EB] items-center justify-center"
    >
      <Image
        source={{ uri: item?.image?.url || null }}
        resizeMode="contain"
        style={{ width: scale(65), height: verticalScale(72) }}
        className=""
      />
      <Text className="text-center mt-[2%] font-poppins-semiBold text-sm text-gray-800">
        {(item?.title || "N/A").split(" ").slice(0, 1).join(" ")}
      </Text>
    </Pressable>
  );
};

export default function PopularServicesView() {
  const { data, isLoading, error } = useGetServiceCategoriesQuery();

  const serviceCategories = data?.data?.categories || [];

  return (
    <View className="flex-1 bg-[#F9F9F9] py-[3%]">
      <CustomHeader />

      {/* Services List */}
      <View className="mx-[6%] mt-[1.6%]">
        {isLoading ? (
          <View
            className="flex-1 items-center justify-center"
            style={{ marginTop: verticalScale(50) }}
          >
            <ActivityIndicator size="large" color="#0066CC" />
            <Text className="mt-2 font-poppins-regular text-gray-600">
              Loading services...
            </Text>
          </View>
        ) : error ? (
          <View
            className="flex-1 items-center justify-center"
            style={{ marginTop: verticalScale(50) }}
          >
            <Text className="font-poppins-semiBold text-red-500">
              Failed to load services
            </Text>
            <Text className="mt-2 font-poppins-regular text-gray-600 text-center">
              {error?.message || "Please try again later"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={
              serviceCategories.length > 0
                ? serviceCategories
                : popularSeviceData
            }
            renderItem={({ item }) => <ServiceItem item={item} />}
            keyExtractor={(item, index) => item?._id || index.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: "space-between",
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
        )}
      </View>
    </View>
  );
}
