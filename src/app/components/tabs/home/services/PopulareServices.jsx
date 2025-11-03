import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { scale, verticalScale } from "../../../adaptive/Adaptiveness";
import popularSeviceData from "../../../data/shared/PopularServiceData";
import { router } from "expo-router";
const screenWidth = Dimensions.get("window").width;
const horizontalMargin = screenWidth * 0.12; // 6% left + 6% right
const cardGap = scale(16); // total gap between cards (4% ~ 16px if scale = 4)
const cardWidth = (screenWidth - horizontalMargin - cardGap * 2) / 3.1;

const ServiceItem = ({ item }) => {
  // console.log("show", item?.title.split(" ").slice(0, 1).join(" "));
  return (
    <Pressable
      onPress={() => {}}
      style={[{ width: cardWidth, height: verticalScale(110) }]}
      className="bg-white  mr-[2%] border rounded-lg border-[#D4E0EB] items-center justify-center "
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

export default function PopularServices({ categories }) {
  return (
    <View className="flex-1  mx-[6%] py-[3%]">
      {/* Header */}
      <View className="flex-row justify-between">
        <Text className="font-poppins-semiBold text-base text-[#6B7280] ">
          Popular Services
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/services/popularServicesView")}
        >
          <Text className="font-poppins-semiBold text-base text-[#18649F] ">
            View all
          </Text>
        </TouchableOpacity>
      </View>

      {/* Services List */}
      <View className="mt-[1.6%] ">
        <FlatList
          data={categories || popularSeviceData}
          renderItem={({ item }) => <ServiceItem item={item} />}
          keyExtractor={(item, index) => item.id || index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToAlignment="start"
          snapToInterval={264}
          contentContainerStyle={{
            paddingRight: scale(100),
          }}
        />
      </View>
    </View>
  );
}
