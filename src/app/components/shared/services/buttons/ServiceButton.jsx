import { View, Text, Pressable } from "react-native";

export default function CustomButton({
  title,
  onPress,
  bg = "#175994",
  border = "#0054A5",
  width = "full",
  disabled = false,
}) {
  return (
    <View
      style={{
        backgroundColor: disabled ? "#D1D5DB" : bg,
        borderColor: disabled ? "#9CA3AF" : border,
        width: width,
        opacity: disabled ? 0.6 : 1,
      }}
      className="mt-[3%] border rounded-md px-[3%] py-[3%]"
    >
      <Pressable onPress={onPress} disabled={disabled}>
        <Text
          style={{ color: disabled ? "#6B7280" : "#FFFFFF" }}
          className="font-poppins-bold text-center"
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
}
