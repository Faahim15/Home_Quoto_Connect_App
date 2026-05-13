import { View, Text, ActivityIndicator, Pressable } from "react-native";

export default function FormButton({ title, onPress, isLoading }) {
  return (
    <View className="flex-1 justify-end pb-[20%]">
      <Pressable
        onPress={onPress}
        disabled={isLoading}
        className="bg-[#0054A5] mx-[5%] rounded-lg py-[4%] items-center"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center text-base font-poppins-semiBold">
            {title}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
