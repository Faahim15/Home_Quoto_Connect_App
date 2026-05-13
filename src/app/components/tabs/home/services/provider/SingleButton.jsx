import { View, Text, TouchableOpacity, Pressable } from "react-native";

export default function SingleButton({
  title,
  selected,
  onPress,
  handleInputChange,
}) {
  function handleButton() {
    if (onPress) {
      onPress();
      handleInputChange("urgency", title);
    }
  }

  return (
    <Pressable onPress={handleButton}>
      <View
        className={`border mt-[2%] bg-[#F9F9F9] rounded-full py-[2%] px-[3%] ${
          selected ? "border-[#2C3E50]" : "border-[#AAB7B8]"
        }`}
      >
        <Text
          className={`font-poppins-400regular text-center px-[3%] text-base ${
            selected ? "text-black font-bold" : "text-[#80898A]"
          }`}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
