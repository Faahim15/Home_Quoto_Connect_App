import { scale, verticalScale } from "../../../adaptive/Adaptiveness";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import categories from "../../../data/shared/Categories";
const screenWidth = Dimensions.get("window").width;
const horizontalMargin = screenWidth * 0.12; // 6% left + 6% right
const cardGap = scale(16); // total gap between cards (4% ~ 16px if scale = 4)
const cardWidth = (screenWidth - horizontalMargin - cardGap * 2) / 3.1;

const ServiceCard = ({ item }) => (
  <Pressable
    style={[{ width: cardWidth, height: verticalScale(130) }]}
    className="bg-white mr-[2%] rounded-lg border border-[#D4E0EB] items-center justify-center "
  >
    <Image
      source={{ uri: item.icon }}
      resizeMode="contain"
      style={{ width: scale(69), height: verticalScale(75) }}
      className=" mb-[15%]"
    />
    <Text className="text-center  font-poppins-semiBold text-sm text-gray-800">
      {item.name}
    </Text>
  </Pressable>
);

export default function TopServices() {
  return (
    <View className=" flex-1 mx-[6%]  mt-[2.5%] ">
      {categories.map((section, index) => (
        <View key={index} className="mb-[6%]">
          <Text className="font-poppins-semiBold text-[#565656] text-base">
            {section.title}
          </Text>

          <View className=" mt-[1.5%]">
            <FlatList
              data={section.data}
              renderItem={({ item }) => <ServiceCard item={item} />}
              keyExtractor={(item, idx) => idx.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToAlignment="start"
              snapToInterval={264}
              contentContainerStyle={{
                paddingRight: scale(60),
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
