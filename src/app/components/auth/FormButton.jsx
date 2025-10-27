import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

export default function FormButton({ title, onPress, isLoading }) {
  return (
    <View className="flex-1 justify-end pb-[20%]">
      <TouchableOpacity
        onPress={onPress}
        className=" bg-[#0054A5] mx-[5%] rounded-lg py-[4%]"
      >
        <Text className="text-white text-center text-base font-poppins-semiBold ">
          {isLoading ? <ActivityIndicator color="#fff" /> : title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
