import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { scale, verticalScale } from "../../../adaptive/Adaptiveness";
import popularSeviceData from "../../../data/shared/PopularServiceData";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image"; // ← এটা add করো উপরে
const screenWidth = Dimensions.get("window").width;
const horizontalMargin = screenWidth * 0.12;
const cardGap = scale(16);
const cardWidth = (screenWidth - horizontalMargin - cardGap * 2) / 3.1;

const ServiceItem = ({ item }) => {
  return (
    <Pressable
      onPress={() => {}}
      style={[{ width: cardWidth, height: verticalScale(140) }]}
      className="bg-white border border-[#D4E0EB] rounded-2xl overflow-hidden"
    >
      {/* ── Image ── */}
      <Image
        source={{ uri: item?.image?.url || null }}
        contentFit="cover"
        transition={300}
        style={{ width: "100%", height: verticalScale(95) }}
      />

      {/* ── Title ── */}
      <View className="flex-1 items-center justify-center px-2">
        <Text
          className="text-center font-poppins-semiBold text-sm text-gray-800"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {(item?.title || "N/A").split(" ").slice(0, 1).join(" ")}
        </Text>
      </View>
    </Pressable>
  );
};

export default function PopularServices({ categories }) {
  const data = categories || popularSeviceData;
  const hasData = data && data.length > 0;

  return (
    <View className="flex-1  mx-[6%] py-[3%]">
      {/* Header */}
      <View className="flex-row justify-between">
        <Text className="font-poppins-semiBold text-base text-[#6B7280] ">
          Popular Services
        </Text>
        {hasData && (
          <Pressable
            onPress={() => router.push("/services/popularServicesView")}
          >
            <Text className="font-poppins-semiBold text-base text-[#18649F] ">
              View all
            </Text>
          </Pressable>
        )}
      </View>

      {/* Services List */}
      <View className="mt-[1.6%] ">
        {!hasData ? (
          <View
            className="bg-white border border-[#D4E0EB] rounded-lg items-center justify-center"
            style={{ height: verticalScale(110), width: "100%" }}
          >
            <Ionicons name="grid-outline" size={scale(30)} color="#D1D5DB" />
            <Text className="font-poppins-500medium text-sm text-[#9CA3AF] mt-1">
              No services available
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => <ServiceItem item={item} />}
            keyExtractor={(item, index) => item.id || index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToAlignment="start"
            snapToInterval={264}
            ItemSeparatorComponent={() => <View style={{ width: scale(10) }} />} // ← এটা add করো
            contentContainerStyle={{
              paddingRight: scale(100),
            }}
          />
        )}
      </View>
    </View>
  );
}
