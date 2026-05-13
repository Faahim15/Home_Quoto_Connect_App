import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import XStyle from "../../../util/styles";
export default function AccountOptionItem({
  title,
  color = "#000000",
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={XStyle.shadowBox}
      className="flex-row mt-[3%] rounded-2xl border border-[#fff] justify-between"
    >
      <Text
        style={{ color: color }}
        className="font-poppins-400regular text-sm  "
      >
        {title}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#333333" />
    </Pressable>
  );
}
