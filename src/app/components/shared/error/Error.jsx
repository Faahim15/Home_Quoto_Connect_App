import { View, Text } from "react-native";
export default function Error({ error }) {
  return (
    <View>
      {error && (
        <Text className="text-red-700 font-poppins text-center mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
