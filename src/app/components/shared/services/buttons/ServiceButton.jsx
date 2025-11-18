import { View, Text, TouchableOpacity } from "react-native";

export default function CustomButton({
  title,
  onPress,
  bg = "#175994",
  border = "#0054A5",
  width = "full",
}) {
  return (
    <View
      style={{ backgroundColor: bg, borderColor: border, width: width }}
      className="mt-[3%] border rounded-md  px-[3%] py-[3%] "
    >
      <TouchableOpacity onPress={onPress}>
        <Text className="text-white font-poppins-bold text-center">
          {" "}
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
