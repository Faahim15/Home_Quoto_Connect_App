import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { scale } from "../../adaptive/Adaptiveness";

export default function Loading() {
  return (
    <View className="flex-1 bg-[#F9FAFB] justify-center items-center">
      <View className="flex-col items-center justify-center">
        <ActivityIndicator
          size="large"
          color="#175994"
          style={{ marginBottom: scale(16) }}
        />
        <Text className="font-poppins-500medium text-base text-[#565656]">
          Loading Your Profile...
        </Text>
        <Text className="font-poppins-400regular text-xs text-[#6B7280] mt-2">
          Preparing your home screen
        </Text>
      </View>
    </View>
  );
}
