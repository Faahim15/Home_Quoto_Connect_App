import { View, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
export default function CustomButton({
  isLoading,
  title,
  onPress,
  agreeToTerms = true,
}) {
  return (
    <View className=" mt-[3%] bg-[#175994] border rounded-md border-[#0054A5] px-[3%] py-[3%] ">
      <TouchableOpacity
        disabled={!agreeToTerms}
        style={{ opacity: agreeToTerms ? 1 : 0.6 }}
        onPress={onPress}
      >
        <Text className="text-white font-poppins-bold text-center">
          {isLoading ? <ActivityIndicator color="#ffffff" /> : title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
