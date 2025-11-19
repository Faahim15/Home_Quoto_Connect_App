import { View, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
export default function CustomButton({
  isLoading = false,
  title,
  onPress,
  agreeToTerms = true,
  bg = "#175994",
  text = "#fff",
  borderColor = "#0054A5",
}) {
  return (
    <View
      style={{ backgroundColor: bg, borderColor: borderColor }}
      className=" mt-[3%] border rounded-md px-[3%] py-[3%] "
    >
      <TouchableOpacity
        disabled={!agreeToTerms}
        style={{ opacity: agreeToTerms ? 1 : 0.6 }}
        onPress={onPress}
      >
        <Text
          style={{ color: text }}
          className=" font-poppins-bold text-center"
        >
          {isLoading ? <ActivityIndicator color="#ffffff" /> : title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
