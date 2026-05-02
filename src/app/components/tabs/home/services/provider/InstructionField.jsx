import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { verticalScale } from "../../../../adaptive/Adaptiveness";

export default function InstructionField({ onChangeText, mode, value }) {
  return (
    <View>
      <View
        className={` mt-[6%] ${mode === "bio" ? " bg-[#f9f9f9]" : "bg-[#f9f9f9]"} `}
      >
        <Text className="font-poppins-500medium text-base text-[#5C5F62]">
          {mode === "bio"
            ? "Describe the services you offer"
            : "Provide Specific Instructions or Details"}
        </Text>

        <TextInput
          className="text-black font-poppins-400regular bg-[#f9f9f9] border  rounded-md border-[#CACACA] px-[2%] mt-[2%] "
          placeholder="Write here.."
          placeholderTextColor="#898989"
          multiline
          value={value || ""}
          onChangeText={onChangeText}
          textAlignVertical="top"
          style={{ minHeight: verticalScale(100) }}
        />
      </View>
    </View>
  );
}
