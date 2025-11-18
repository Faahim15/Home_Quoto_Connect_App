import { View, Text, TextInput } from "react-native";
export default function InputField({
  label,
  keyboardType,
  placeholder,
  onChangeText,
}) {
  return (
    <View className="mt-[1.5%]">
      <Text className="font-poppins-400regular bg-gray-50 text-base text-[#5C5F62] ">
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#898989"
        onChangeText={onChangeText}
        className=" font-poppins-400regular bg-white px-[4%] py-[4%] mt-[1%]  text-black border border-gray-200 rounded-xl "
      />
    </View>
  );
}
