import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
export default function ArrowBack() {
  return (
    <View className="pt-[3%] px-[6%]">
      <Pressable
        onPress={() => router.back()}
        className="w-10 h-10 justify-center"
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>
    </View>
  );
}
