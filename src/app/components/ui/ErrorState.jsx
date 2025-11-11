import { Text } from "react-native";
import { View } from "react-native";

// Error State Component
const ErrorState = ({ error }) => (
  <View className="flex-1 justify-center items-center py-[40%] px-[8%]">
    <Text className="font-poppins-500medium text-red-600 text-xl mb-2">
      Something went wrong
    </Text>
    <Text className="font-poppins-400regular text-gray-600 text-center text-base">
      {error?.message || "Unable to load quotes. Please try again later."}
    </Text>
  </View>
);

export default ErrorState;
