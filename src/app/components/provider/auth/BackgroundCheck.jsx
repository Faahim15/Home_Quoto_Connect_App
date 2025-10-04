import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { timer } from "../../../../../assets/svg/icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

export default function BackgroundCheckScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-[6%] py-[8%]">
        {/* Status Badge */}
        <View className="flex-row gap-x-[2%] items-center mb-[6%]">
          {/* <Ionicons name="time-outline" size={16} color="#FFA500" /> */}
          <SvgXml xml={timer} height={verticalScale(28)} width={scale(18)} />

          <Text className="text-[#FFA500] font-poppins-semiBold text-base">
            Background Check: Pending
          </Text>
        </View>

        {/* Return to Dashboard Button */}
        <TouchableOpacity
          className="bg-blue-700 rounded-lg py-[4%] items-center mb-[8%]"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            Return to Dashboard
          </Text>
        </TouchableOpacity>

        {/* What's Next Section */}
        <View className="flex-row bg-white rounded-xl p-[5%] shadow-sm">
          <View className="mr-[4%]">
            <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
              <Ionicons name="information" size={16} color="white" />
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-gray-900 font-poppins-semiBold text-base mb-2">
              What's Next?
            </Text>
            <Text className="text-gray-600 font-poppins-400regular text-sm leading-5">
              Background checks typically take 1-3 business days. You'll receive
              an email notification once your clearance is complete and you can
              start accepting jobs.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
