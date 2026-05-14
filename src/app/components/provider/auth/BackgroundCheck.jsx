import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { timer } from "../../../../../assets/svg/icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { router } from "expo-router";

export default function BackgroundCheckScreen() {
  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="px-[6%] ">
        {/* Status Badge */}
        <View className="flex-row gap-x-[2%] mt-[17%] justify-center items-center mb-[5%]">
          {/* <Ionicons name="time-outline" size={16} color="#FFA500" /> */}
          <SvgXml xml={timer} height={verticalScale(18)} width={scale(18)} />

          <Text className="text-[#FFA500]  font-poppins-semiBold text-base">
            Background Check: Pending
          </Text>
        </View>

        {/* Return to Dashboard Button */}
        <Pressable
          className="bg-[#175994] items-center mx-[2%] justify-center rounded-lg mb-[8%]"
          activeOpacity={0.8}
          style={{ width: scale(311), height: verticalScale(52) }}
          onPress={() => router.replace("provider/home")}
        >
          <Text className="text-white font-poppins-bold text-base">
            View Available Jobs
          </Text>
        </Pressable>

        {/* What's Next Section */}
        <View className="flex-row bg-[#F9FAFB] rounded-xl p-[5%] shadow-sm">
          <View className="mr-[4%]">
            <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
              <Ionicons name="information" size={16} color="white" />
            </View>
          </View>

          <View className="flex-1 bg-[#F9FAFB] ">
            <Text className="text-[#000000] font-poppins-500medium text-base mb-1">
              What's Next?
            </Text>
            <Text className="text-[#444444] text-justify font-poppins-400regular text-sm ">
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
