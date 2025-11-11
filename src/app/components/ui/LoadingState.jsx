import { Text } from "react-native";
import { ActivityIndicator, View } from "react-native";

const LoadingState = () => (
  <View className="flex-1 justify-center items-center py-[40%]">
    <ActivityIndicator size="large" color="#0054A5" />
    <Text className="font-poppins-400regular text-gray-600 text-base mt-4">
      Loading quotes...
    </Text>
  </View>
);

export default LoadingState;
