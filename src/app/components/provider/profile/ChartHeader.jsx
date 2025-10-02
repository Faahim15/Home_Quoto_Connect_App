import { View, Text } from "react-native";
import React from "react";

export default function ChartHeader({ title }) {
  return (
    <View className="mt-[3%]">
      <Text className="font-poppins-bold text-center text-base text-black">
        {title}
      </Text>
    </View>
  );
}
