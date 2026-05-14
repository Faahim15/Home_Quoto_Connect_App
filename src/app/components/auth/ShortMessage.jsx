import { View, Text, Pressable } from "react-native";

export default function ShortMessage({ title, btnText, onPress }) {
  return (
    <View className="flex-row gap-[1%] mt-[4%] justify-center">
      <Text className="font-poppins-400regular text-sm text-black">
        {title}
      </Text>
      <Pressable onPress={onPress}>
        <Text className="font-poppins-semiBold underline text-sm text-[#0054A5] ">
          {btnText}
        </Text>
      </Pressable>
    </View>
  );
}
