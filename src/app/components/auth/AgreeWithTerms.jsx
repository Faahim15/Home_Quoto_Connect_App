import { router } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function AgreeWithTerms() {
  return (
    <View className="flex-row items-center justify-center">
      <Text className="text-sm font-poppins-400regular text-black">
        Agree to the
      </Text>
      <View className="flex-row">
        <Pressable onPress={() => router.push("/profile/terms")}>
          <Text className="text-[#0054A5] text-sm">
            {""} Terms & Conditions{" "}
          </Text>
        </Pressable>
        <Text className="text-black text-sm ">and {""}</Text>
        <Pressable onPress={() => router.push("/profile/privacy")}>
          <Text className="text-[#0054A5] text-sm">Privacy Policy</Text>
        </Pressable>
      </View>
    </View>
  );
}
