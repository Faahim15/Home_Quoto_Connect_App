import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";

export default function ProfileButton({ title, onPress, isLoading }) {
  return (
    <View className="">
      <Pressable
        onPress={onPress}
        className=" bg-[#0054A5] mx-[5%] rounded-lg py-[4%]"
      >
        <Text className="text-white text-center text-base font-poppins-semiBold ">
          {isLoading ? <ActivityIndicator color="#fff" /> : title}
        </Text>
      </Pressable>
    </View>
  );
}
