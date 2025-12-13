import { Text, TouchableOpacity } from "react-native";

export default function ActionButton({
  color = "#fff",
  backgroundColor = "#0054A5",
  borderColor = "#0054A5",
  title,
  onPress,
  disabled = false,
}) {
  // Determine colors based on disabled state
  const finalBackgroundColor = disabled ? "#E0E0E0" : backgroundColor;
  const finalBorderColor = disabled ? "#CACACA" : borderColor;
  const finalTextColor = disabled ? "#898989" : color;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: finalBackgroundColor,
        borderColor: finalBorderColor,
      }}
      className="items-center border px-[4%] mb-[2%] py-[4%] rounded-md justify-center"
    >
      <Text
        style={{ color: finalTextColor }}
        className="font-poppins-bold text-base"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
