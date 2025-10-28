import { Text, TextInput, View } from "react-native";

export default function TextField({ value, onChangeText }) {
  return (
    <View className="bg-[#f9f9f9]">
      <Text className="font-poppins-400regular text-base text-[#1F2937] ">
        Title of the Job
      </Text>

      <View className="px-[4%] mt-[3%] py-[3%] bg-[#f9f9f9] border border-[#D4E0EB] rounded-lg ">
        <TextInput
          placeholder="What's the title of the workshop?"
          placeholderTextColor="#6B7280"
          value={value ? value : ""}
          onChangeText={onChangeText}
          className="font-poppins-400regular items-center justify-center bg-[#f9f9f9]  text-sm text-black"
        />
      </View>
    </View>
  );
}
