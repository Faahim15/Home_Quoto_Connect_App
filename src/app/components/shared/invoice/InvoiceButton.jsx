import { View, Text, Pressable } from "react-native";
import React from "react";
import { SvgXml } from "react-native-svg";
import { downloadIcon } from "../../../../../assets/svg/icons";

export default function InvoiceButton({ onPress }) {
  return (
    <View className="bg-[#2563EB] mb-[8%] py-[3%] mx-[6%] mt-[4%] border border-[#2563EB] rounded-lg ">
      <Pressable onPress={onPress}>
        <View className="flex-row justify-center items-center">
          <SvgXml xml={downloadIcon} width={16} height={24} />
          <Text className="ml-[3%] font-poppins-500medium text-base text-white ">
            Download Invoice as PDF
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
