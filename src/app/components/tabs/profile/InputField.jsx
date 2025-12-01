import { View, Text, TextInput } from "react-native";

export default function InputField({
  label,
  keyboardType,
  placeholder,
  onChangeText,
  value,
  editable = true,
}) {
  return (
    <View className="mt-[1.5%]">
      {label && (
        <Text className="font-poppins-400regular bg-gray-50 text-base text-[#5C5F62]">
          {label}
        </Text>
      )}

      <TextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#898989"
        onChangeText={onChangeText}
        value={value}
        editable={editable}
        className={`font-poppins-400regular bg-white px-[4%] py-[4%] mt-[1%] text-black border border-gray-200 rounded-xl ${!editable ? "opacity-60" : ""}`}
      />
    </View>
  );
}
