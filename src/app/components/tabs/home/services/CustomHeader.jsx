import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CustomHeader({ title = "Popular Services" }) {
  return (
    <View className="flex-row bg-[#F9F9F9] w-full h-[3%] ml-[6%] gap-[3%]">
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>
      <Text className="font-poppins-semiBold text-xl ">{title}</Text>
    </View>
  );
}
