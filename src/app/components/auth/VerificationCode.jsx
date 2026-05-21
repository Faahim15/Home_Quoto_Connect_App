import { useRef, useState } from "react";
import { TextInput, View, Text } from "react-native";
import { scale, verticalScale } from "../adaptive/Adaptiveness";

export default function VerificationCodeField({
  error,
  otp,
  handleOtpChange,
  handleOtpPaste,
}) {
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleChange = (text, index) => {
    if (text.length > 1) {
      const digits = text.replace(/\D/g, "").slice(0, 6);
      handleOtpPaste(digits);

      const lastFilled = Math.min(digits.length - 1, 5);
      inputRefs.current[lastFilled]?.focus();

      if (digits.length === 6) {
        inputRefs.current[5]?.blur();
      }
      return;
    }

    const digit = text.replace(/\D/g, "");
    handleOtpChange(digit, index);

    if (digit.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digit.length === 1 && index === 5) {
      inputRefs.current[5]?.blur();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace") {
      if (otp[index] !== "") {
        handleOtpChange("", index);
      } else if (index > 0) {
        handleOtpChange("", index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View className="mx-[6%] mt-[3%]">
      <View className="flex-row items-center gap-x-1 w-full max-w-sm">
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="bg-[#F9FAFB] text-black font-poppins-bold text-base rounded-lg aspect-square text-center"
            style={{
              height: verticalScale(54),
              width: scale(53.83),
              borderWidth: 1,
              borderColor: focusedIndex === index ? "#0054A5" : "#DCDCDC",
            }}
            keyboardType="number-pad"
            maxLength={index === 0 ? 6 : 1}
            value={value}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            returnKeyType="done"
            onSubmitEditing={() => inputRefs.current[index]?.blur()}
            blurOnSubmit={false}
            caretHidden={true}
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
