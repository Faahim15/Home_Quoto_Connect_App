import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Animated } from "react-native";

export default function VerificationCodeField({ error, onOtpChange }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);

  const hiddenInputRef = useRef(null);
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blink, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const updateOtp = (value) => {
    setOtp(value);
    onOtpChange?.(value);
    const nextIndex = value.findIndex((v) => v === "");
    setActiveIndex(nextIndex === -1 ? 5 : nextIndex);
  };

  const handleChange = (text) => {
    const value = text.replace(/\D/g, "");
    const newOtp = ["", "", "", "", "", ""];
    value
      .split("")
      .slice(0, 6)
      .forEach((d, i) => {
        newOtp[i] = d;
      });
    updateOtp(newOtp);
  };

  const handleKeyPress = (e) => {
    if (e.nativeEvent.key !== "Backspace") return;
    const newOtp = [...otp];
    const last = newOtp.findLastIndex((v) => v !== "");
    if (last >= 0) {
      newOtp[last] = "";
      updateOtp(newOtp);
    }
  };

  return (
    <View className="items-center mt-5">
      {/* Hidden Input */}
      <TextInput
        ref={hiddenInputRef}
        value={otp.join("")}
        onChangeText={handleChange}
        onKeyPress={handleKeyPress}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
        style={{
          position: "absolute",
          opacity: 0,
          height: 1,
          width: 1,
        }}
      />

      {/* OTP UI */}
      <View className="flex-row justify-between w-[90%]">
        {otp.map((digit, index) => {
          const isActive = index === activeIndex;

          return (
            <View
              key={index}
              style={{
                width: "14%",
                height: 48,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: 6,
                borderBottomWidth: 2,
                borderBottomColor: isActive ? "#0054A5" : "#ccc",
              }}
            >
              {digit !== "" ? (
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "#0054A5",
                  }}
                >
                  {digit}
                </Text>
              ) : isActive ? (
                // 🔥 Blinking cursor shown centered in empty active box
                <Animated.View
                  style={{
                    width: 2,
                    height: 22,
                    backgroundColor: "#0054A5",
                    opacity: blink,
                  }}
                />
              ) : null}
            </View>
          );
        })}
      </View>

      {error ? (
        <Text className="text-red-500 text-xs mt-2">{error}</Text>
      ) : null}
    </View>
  );
}
