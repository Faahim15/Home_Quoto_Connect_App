import { View, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
export default function ReviewButton({ totalReviews, id }) {
  return (
    <View className="px-[6%] pb-[6%] ">
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/services/showAllReview",
            params: { id: id },
          })
        }
        className="border px-[3%] py-[3%] rounded-md bg-[#F9F9F9] border-[#1F2937]"
      >
        <Text className="font-poppins-bold text-center text-base text-[#1F2937]">
          {totalReviews > 9
            ? `Show All ${totalReviews} Reviews`
            : "Show All Review"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
