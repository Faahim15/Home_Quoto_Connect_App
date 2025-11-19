import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale } from "../../../../../adaptive/Adaptiveness";
import Reviews from "./Reviews";
export default function Testimonials({ testimonialData }) {
  return (
    <View className="mx-[6%] mt-[3%] ">
      <View className="flex-row justify-between ">
        <View className="flex-row">
          <Ionicons name="star" size={18} color="#F59E0B" />
          <Text className="font-poppins-semiBold text-base text-[#565656]">
            {" "}
            {Number(testimonialData?.provider?.averageRating) / 10 || "N/A"}
          </Text>
        </View>
        <Text className="font-poppins-semiBold text-base text-[#565656]">
          {testimonialData?.reviews.length}{" "}
          {testimonialData?.reviews.length > 1 ? "Reviews" : "Review"}
        </Text>
      </View>
      <View className="mt-[2%] ">
        <FlatList
          data={testimonialData?.reviews}
          horizontal
          keyExtractor={(item, index) => item?._id || index.toString()}
          renderItem={({ item }) => {
            return <Reviews data={item} />;
          }}
          contentContainerStyle={{ paddingRight: scale(16) }} // gap between items
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
