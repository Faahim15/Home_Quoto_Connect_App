import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "../../../../../adaptive/Adaptiveness";
import Reviews from "./Reviews";

export default function AllReviews({ allReview }) {
  return (
    <View className=" mt-[3%] ">
      <View className="flex-row justify-between ">
        <View className="flex-row">
          <Ionicons name="star" size={18} color="#F59E0B" />
          <Text className="font-poppins-semiBold text-base text-[#565656]">
            {" "}
            {Number(allReview?.provider?.averageRating) / 10}
          </Text>
        </View>
        <Text className="font-poppins-semiBold text-base text-[#565656]">
          {allReview.reviews.length}{" "}
          {allReview?.reviews.length > 1 ? "Reviews" : "Review"}
        </Text>
      </View>
      <View className="mt-[4%] justify-center items-center ">
        <FlatList
          data={allReview?.reviews}
          keyExtractor={(item, index) => item?._id || index.toString()}
          numColumns={1}
          renderItem={({ item }) => {
            return <Reviews width={320} data={item} />;
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(40) }}
        />
      </View>
    </View>
  );
}
