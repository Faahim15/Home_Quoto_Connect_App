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
  disabled,
}) {
  return (
    <View
      style={{
        backgroundColor: disabled ? "#9CA3AF" : bg, // lighter gray for disabled
        borderColor: disabled ? "#9CA3AF" : borderColor,
      }}
      className="mt-[3%] border rounded-md px-[3%] py-[3%]"
    >
      <TouchableOpacity disabled={disabled || !agreeToTerms} onPress={onPress}>
        <Text
          style={{ color: disabled ? "#FFFFFF" : text }} // white text on disabled gray
          className="font-poppins-bold text-center"
        >
          {isLoading ? <ActivityIndicator color="#ffffff" /> : title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
