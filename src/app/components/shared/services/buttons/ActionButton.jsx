import { Pressable, Text, TouchableOpacity } from "react-native";
export default function ActionButton({ title }) {
  return (
    <Pressable
      onPress={() => navigation.navigate(route)}
      className="border px-[3%] py-[3%] rounded-md bg-[#F9F9F9] border-[#1F2937]"
    >
      <Text className="font-poppins-bold text-center text-base text-[#1F2937]">
        {title}
      </Text>
    </Pressable>
  );
}
