import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const { width } = Dimensions.get("window");
import { electricianData } from "../components/data/shared/ServicesData";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import CustomHeader from "../components/tabs/home/services/CustomHeader";
import { useLocalSearchParams } from "expo-router";

const cardWidth = width * 0.45;

const ServiceCard = ({ item }) => {
  return (
    <View
      className="bg-white border border-[#D4E0EB] flex-1 justify-center items-center rounded-lg mr-3"
      style={{ width: scale(149), height: verticalScale(210) }}
    >
      <Image
        source={{ uri: item.image }}
        resizeMode="contain"
        className=""
        style={{
          width: scale(72),
          height: verticalScale(110),
          paddingBottom: verticalScale(0),
        }}
      />
      <View className="flex-1 pb-[10%] justify-end">
        <Text className="font-poppins-semiBold text-base text-[#565656]">
          {item.name}
        </Text>
        <Text className="font-poppins-500medium text-xs text-[#565656] mb-[1%]">
          {item.occupation}
        </Text>

        <View className="flex-row items-center">
          <Ionicons name="star" size={14} color="#F59E0B" />
          <Text className="ml-1 font-poppins-500medium text-xs text-[#F59E0B]">
            {item.rating}
          </Text>
          {/* <Text className="ml-auto font-poppins-400regular text-base text-[#18649F]">
            {item.price}
          </Text> */}
        </View>

        <Pressable
          onPress={
            () => {}
            // navigation.navigate("ProviderDetailsScreen", {
            //   showBook: true,
            //   provider: item,
            // })
          }
          style={{ width: scale(124), height: verticalScale(25) }}
          className="bg-[#0054A5] border border-[#0054A5] mt-[3%] rounded-md py-[3%] px-[3%]"
        >
          <Text className="font-poppins-500medium text-[10px] text-center text-white font-semibold">
            Details
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function ElectricianProviderScreen({ route }) {
  const { header } = useLocalSearchParams();
  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <CustomHeader title={header} />
      <View className="flex-1 mt-[2.5%] mx-[6.4%] mb-2 ">
        <FlatList
          data={electricianData}
          renderItem={({ item }) => <ServiceCard item={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ItemSeparatorComponent={() => (
            <View style={{ height: verticalScale(16) }} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
