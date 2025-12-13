import { View, Image, Text } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ContractorDetails({ userData }) {
  // const isVerified = userData?.isVerified;
  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const verifiedStatus = await AsyncStorage.getItem("isVerified");
        // Convert string "true" to boolean true, everything else to false
        setIsVerified(verifiedStatus === "true");
      } catch (error) {
        console.error("Error reading verification status:", error);
        setIsVerified(false);
      }
    };

    checkVerificationStatus();
  }, []);

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
            <Image
              source={{
                uri: userData?.profilePhoto?.url || null,
              }}
              className="border border-[#fff] rounded-full"
              style={{ width: scale(92), height: verticalScale(92) }}
              resizeMode="cover"
            />
            {/* Verified Badge on Image */}
            {/* {isVerified ? (
              <View className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
                <Ionicons name="checkmark-circle" size={24} color="#2B54A4" />
              </View>
            ) : (
              <View className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
                <Ionicons name="close-circle" size={24} color="#9CA3AF" />
              </View>
            )} */}
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
