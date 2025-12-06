import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React from "react";
import { SvgXml } from "react-native-svg";
import { downloadIcon } from "../../../../../assets/svg/icons";

export default function InvoiceButton({ onPress, isLoading = false }) {
  return (
    <View
      className={`bg-[#2563EB] mb-[8%] py-[3%] mx-[6%] mt-[4%] border border-[#2563EB] rounded-lg ${isLoading ? "opacity-70" : ""}`}
    >
      <Pressable onPress={onPress} disabled={isLoading} activeOpacity={0.8}>
        {isLoading ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
            <Text className="text-white text-base font-poppins-500medium">
              Generating PDF...
            </Text>
          </View>
        ) : (
          <View className="flex-row justify-center items-center">
            <SvgXml xml={downloadIcon} width={16} height={24} />
            <Text className="ml-[3%] font-poppins-500medium text-base text-white ">
              Download Invoice as PDF
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
