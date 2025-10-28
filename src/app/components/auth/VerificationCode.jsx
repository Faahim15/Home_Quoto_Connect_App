import { useRef } from "react";
import { TextInput, View, Text } from "react-native";
import { scale, verticalScale } from "../adaptive/Adaptiveness";

export default function VerificationCodeField({ error, otp, handleOtpChange }) {
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    // ✅ Update parent state
    handleOtpChange(text, index);

    // ✅ Move focus automatically
    if (text.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // ✅ Move back if user deletes a character
    if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="mx-[6%] mt-[3%]">
      <View className="flex-row items-center gap-x-1 w-full max-w-sm">
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="bg-[#F9FAFB] text-black font-poppins-bold text-base border border-[#DCDCDC] rounded-lg aspect-square text-center"
            keyboardType="number-pad"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(text, index)} // 👈 auto-move logic lives here
            style={{ height: verticalScale(54), width: scale(53.83) }}
          />
        ))}
      </View>
      {error && (
        <Text className="text-red-700 font-poppins-400regular text-center mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
