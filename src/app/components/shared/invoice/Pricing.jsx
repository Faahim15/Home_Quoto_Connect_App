import { View, Text } from "react-native";
import React from "react";
import { priceIcon } from "../../../../../assets/svg/icons";
import { SvgXml } from "react-native-svg";
import BreakDown from "./BreakDown";
export default function Pricing({ pricing }) {
  const { subtotal, platformCommission, platformCommissionRate, total } =
    pricing || {};

  return (
    <View className="border-b border-[#E5E7EB] px-[6%] mt-[3%]">
      <View className="border-b border-[#E5E7EB] ">
        {/* header */}
        <View className="flex-row  gap-[2%]">
          <SvgXml xml={priceIcon} height={24} width={14} />
          <Text className="font-poppins-semiBold text-base text-[#1F2937] ">
            Pricing Breakdown
          </Text>
        </View>

        {/* pricing Breakdown */}
        <View className="gap-[2%] pt-[1%] ">
          <BreakDown title="Platform Commission" price={platformCommission} />
          <BreakDown
            title="Platform Commission Rate"
            price={platformCommissionRate}
          />
          {/* <BreakDown title="HST (13%)" price="$26.00" /> */}
        </View>
      </View>
      {/* subtotal */}
      <View className="flex-row pt-[1.5%] justify-between">
        <Text className="font-poppins-500medium text-sm text-[#374151]">
          Subtotal
        </Text>
        <Text className="font-poppins-500medium  text-sm text-[#111827]">
          ${subtotal || ""}
        </Text>
      </View>

      {/* total amount */}
      <View className="flex-row mt-[1%] px-[1%] py-[1%] border border-[#E5E7EB] rounded justify-between bg-[#EFF6FF]">
        <Text className="font-poppins-bold text-xl text-[#1E3A8A] ">
          Total Amount
        </Text>
        <Text className="font-poppins-bold text-xl text-[#1E3A8A] ">
          ${total || ""}
        </Text>
      </View>
    </View>
  );
}
