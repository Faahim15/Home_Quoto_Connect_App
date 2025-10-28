import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { verticalScale } from "../../../../adaptive/Adaptiveness";

export default function InstructionField({ onChangeText }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View className="bg-[#f9f9f9] mt-[6%]">
        <Text className="font-poppins-500medium text-base text-[#5C5F62]">
          Provide Specific Instructions or Details
        </Text>

        <TextInput
          className="text-black font-poppins-400regular bg-[#f9f9f9] border  rounded-md border-[#CACACA] px-[2%] mt-[2%] "
          placeholder="Write here.."
          placeholderTextColor="#898989"
          multiline
          onChangeText={onChangeText}
          textAlignVertical="top"
          style={{ minHeight: verticalScale(100) }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
