import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "../adaptive/Adaptiveness";

export default function TextField({
  label,
  placeholder,
  IconName,
  color = "#fff",
  error,
  onChangeText,
  value,
}) {
  return (
    <View className="mb-[4%]">
      <Text className="font-poppins-400regular text-base text-[#000] mb-[2%]">
        {label}
      </Text>
      <View
        style={{ backgroundColor: color }}
        className="flex-row items-center border border-[#DCDCDC] rounded-md px-[4%] py-[3%]"
      >
        <Ionicons name={IconName} size={20} color="#9E9E9E" />
        <TextInput
          style={{ backgroundColor: color, paddingTop: verticalScale(16) }}
          className="flex-1 font-poppins-400regular ml-[3%] text-sm   text-black "
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          onChangeText={onChangeText}
          value={value || ""}
        />
      </View>
      {error && (
        <Text className="text-red-700 font-poppins text-center mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
