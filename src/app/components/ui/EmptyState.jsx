import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

// Empty State Component
const EmptyState = ({ subtitle }) => (
  <View className="flex-1 mt-[20%] justify-center items-center px-[8%]">
    <View className="bg-[#f9f9f9] rounded-full p-6 ">
      <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
    </View>
    <Text className="font-poppins-500medium text-gray-800 text-xl mb-2">
      No Quotes Available
    </Text>
    <Text className="font-poppins-400regular text-gray-600 text-center text-base">
      {subtitle}
    </Text>
  </View>
);

export default EmptyState;
