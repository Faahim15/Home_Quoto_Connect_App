import { View, Text, TouchableOpacity } from "react-native";

export default function MapButton({
  title,
  backgroundColor = "#0054A5",
  color = "#fff",
  borderColor = "#0054A5",
  onPress,
  disabled = false,
}) {
  return (
    <View
      style={{
        backgroundColor: disabled ? "#D1D5DB" : backgroundColor,
        borderColor: disabled ? "#9CA3AF" : borderColor,
        opacity: disabled ? 0.6 : 1,
      }}
      className="px-[4%] py-[3%] border rounded-md"
    >
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <Text
          style={{ color: disabled ? "#6B7280" : color }}
          className="font-poppins-bold text-base"
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
