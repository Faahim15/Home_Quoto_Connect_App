import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EmptyProgressState({ subtitle }) {
  return (
    <View className="flex-1 justify-center items-center px-8 py-12">
      <View className="bg-[#f9f9f9] rounded-full p-6 mb-4">
        <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
      </View>
      <Text className="text-xl font-poppins-500medium text-gray-800 text-center mb-2">
        No Quotes in Progress
      </Text>
      <Text className="text-sm font-poppins-400regular text-gray-500 text-center leading-5">
        {subtitle}
      </Text>
    </View>
  );
}
