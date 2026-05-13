import { View, Text, TouchableOpacity, Pressable } from "react-native";
import SingleButton from "./SingleButton";
import { useState } from "react";
export default function RequestButton({ urgent, onToggleUrgent, disabled }) {
  const handlePress = () => {
    if (!disabled) {
      onToggleUrgent(!urgent);
    }
  };
  return (
    <View className="">
      <Text className="font-poppins-400regular text-base text-center text-[#80898A]">
        Or
      </Text>
      <View className="px-[6%] mt-[3%]">
        <Pressable disabled={disabled} onPress={handlePress}>
          <View
            className={`border mt-[2%] bg-[#F9F9F9] rounded-full py-[2%] px-[3%] ${
              urgent ? "border-[#2C3E50]" : "border-[#AAB7B8]"
            }`}
          >
            <Text
              className={`font-poppins-400regular text-center px-[3%] text-base ${
                urgent ? "text-black font-bold" : "text-[#80898A]"
              }`}
            >
              Req a personalized quote
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
