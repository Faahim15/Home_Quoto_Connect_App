import { Text, View } from "react-native";

// Empty State Component
const EmptyState = () => (
  <View className="flex-1 justify-center items-center py-[40%] px-[8%]">
    <Text className="font-poppins-500medium text-gray-800 text-xl mb-2">
      No Quotes Available
    </Text>
    <Text className="font-poppins-400regular text-gray-600 text-center text-base">
      You don't have any quotes yet. Check back later for new quotes from
      service providers.
    </Text>
  </View>
);

export default EmptyState;
