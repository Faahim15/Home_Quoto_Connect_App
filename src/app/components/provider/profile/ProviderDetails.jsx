import { View, Image, Text } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function ContractorDetails({ userData }) {
  const isVerified = userData?.verificationStatus === "verified";

  return (
    <View>
      <View>
        <Text className="font-poppins-semiBold  text-lg text-[#2B54A4] ">
          My Profile
        </Text>
      </View>
      <View className="flex-row justify-between">
        <View className="mt-[3%] flex-row gap-[4%] ">
          <View>
            {userData?.profilePhoto?.url ? (
              <Image
                source={{
                  uri: userData?.profilePhoto?.url,
                }}
                className="border border-[#fff] rounded-full"
                style={{ width: scale(92), height: verticalScale(92) }}
                resizeMode="cover"
              />
            ) : (
              <View
                className="border border-[#E5E7EB] rounded-full bg-[#F3F4F6] justify-center items-center"
                style={{ width: scale(92), height: verticalScale(92) }}
              >
                <Ionicons name="person" size={50} color="#9CA3AF" />
              </View>
            )}
          </View>
          {/* details */}
          <View className="flex-col gap-[1%] pt-[6%] ">
            <View className="flex-row items-center gap-[2%]">
              <Text className="font-poppins-semiBold text-lg text-[#565656] ">
                {userData?.fullName
                  ? userData.fullName.split(" ").slice(0, 2).join(" ")
                  : "N/A"}
              </Text>
              {isVerified ? (
                <Ionicons name="checkmark-circle" size={18} color="#2B54A4" />
              ) : (
                <View className="bg-gray-200 px-1.5 py-0.5 rounded">
                  <Text className="font-poppins-400regular text-[8px] text-gray-600">
                    Unverified
                  </Text>
                </View>
              )}
            </View>
            <Text className="font-poppins-500medium text-xs text-[#565656] ">
              {userData?.businessName}
            </Text>
            <Text className="text-[#F59E0B]  font-poppins-400regular text-xs ">
              ★ {Number(userData?.averageRating) / 10}
            </Text>
          </View>
        </View>
        {/* Badge */}
        <View className="flex-row  mt-[2%] max-w-[30%] justify-evenly items-center  h-[38%] bg-[#f9f9f9] border-2 border-[#2B54A4] rounded-full px-[3%] py-[1.5%] ">
          <Ionicons
            name="wallet-outline"
            size={20}
            color="#2B54A4"
            style={{ marginRight: "10%" }}
          />
          <Text className="text-[#2B54A4] font-poppins-bold text-base">
            {userData?.credits}
          </Text>
        </View>
      </View>
    </View>
  );
}
