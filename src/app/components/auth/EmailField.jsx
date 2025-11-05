import { View, Text, TextInput, KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "../adaptive/Adaptiveness";
import { useState } from "react";
export default function EmailField({
  label,
  backgroundColor = "#f9f9f9",
  onChangeText,
  error,
  value,
}) {
  return (
    <View className="mb-[4%]">
      <Text className="font-poppins-400regular text-base text-[#000] mb-[2%]">
        {label}
      </Text>
      <KeyboardAvoidingView>
        <View
          style={{ backgroundColor: backgroundColor }}
          className="flex-row items-center border border-[#DCDCDC] rounded-md px-[4%] py-[3%]"
        >
          <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 font-poppins-400regular ml-[3%] text-sm   text-black "
            placeholder="Email"
            placeholderTextColor="#898989"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={onChangeText}
            value={value || ""}
            style={{
              color: "#000",
              paddingTop: verticalScale(16),
              backgroundColor: backgroundColor,
            }}
          />
        </View>
      </KeyboardAvoidingView>
      {error && (
        <Text className="text-red-700 font-poppins text-center mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
