import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Animated } from "react-native";

export default function VerificationCodeField({ error, onOtpChange }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);

  const hiddenInputRef = useRef(null);
  const blink = useRef(new Animated.Value(1)).current;

  // =========================
  // 🔥 BLINK ANIMATION
  // =========================
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

    const fullOtp = value.join("");
    onOtpChange?.(value);

    // update active index properly
    const nextIndex = value.findIndex((v) => v === "");
    setActiveIndex(nextIndex === -1 ? 5 : nextIndex);
  };

  // =========================
  // ✍️ INPUT CHANGE (FIXED)
  // =========================
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
              className="w-[14%] border-b-2 items-center justify-center"
            >
              <Text className="text-2xl font-bold text-[#0054A5]">{digit}</Text>

              {/* 🔥 blinking cursor */}
              {isActive && digit === "" && (
                <Animated.View
                  style={{
                    position: "absolute",
                    bottom: 6,
                    width: 2,
                    height: 24,
                    backgroundColor: "#0054A5",
                    opacity: blink,
                  }}
                />
              )}
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
