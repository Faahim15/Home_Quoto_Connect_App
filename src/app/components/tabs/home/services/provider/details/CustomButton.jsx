import { View, Text, Pressable, ActivityIndicator } from "react-native";

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
        backgroundColor: disabled ? "#9CA3AF" : bg,
        borderColor: disabled ? "#9CA3AF" : borderColor,
      }}
      className="mt-[3%] border rounded-md px-[3%] py-[3%]"
    >
      <Pressable
        disabled={disabled || isLoading || !agreeToTerms}
        onPress={onPress}
        style={{ alignItems: "center" }} // ✅
      >
        {isLoading ? ( // ✅ Text এর বাইরে
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text
            style={{ color: disabled ? "#FFFFFF" : text }}
            className="font-poppins-bold text-center"
          >
            {title}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
