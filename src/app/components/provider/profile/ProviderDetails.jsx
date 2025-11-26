import { View, Image, Text } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { Ionicons } from "@expo/vector-icons";
export default function ContractorDetails({ userData }) {
  return (
    <View>
      <View>
        <Text className="font-poppins-semiBold  text-lg text-[#2B54A4] ">
          My Profile
        </Text>
      </View>
      <View className="flex-row justify-between">
        <View className="mt-[3%] flex-row gap-[4%] ">
          <Image
            source={{
              uri: userData?.profilePhoto?.url || null,
            }}
            className="border border-[#fff] rounded-full"
            style={{ width: scale(92), height: verticalScale(92) }}
            resizeMode="cover"
          />
          {/* details */}
          <View className="flex-col gap-[1%] pt-[6%] ">
            <Text className="font-poppins-semiBold text-lg text-[#565656] ">
              {userData?.fullName || "N/A"}
            </Text>
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
