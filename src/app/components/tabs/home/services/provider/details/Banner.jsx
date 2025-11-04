import { View, Text, Image, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "../../../../../adaptive/Adaptiveness";
import { Ionicons } from "@expo/vector-icons";

export default function Banner({ data }) {
  return (
    <View>
      <View className="flex-row mt-[3%] mx-[6%] justify-between">
        <View>
          <Text className="font-poppins-semiBold text-2xl text-[#565656]">
            {data?.name || "N/A"}
          </Text>
          <Text className="font-poppins-500medium text-base text-[#565656]">
            {data?.designation || "N/A"}
          </Text>
        </View>
        <View className="flex-row w-[50%] justify-between ">
          <View></View>
          <View></View>
          <View></View>
          <TouchableOpacity
            style={{ width: scale(44), height: verticalScale(44) }}
            className="rounded-full items-center justify-center bg-[#319FCA] "
          >
            <Ionicons name="call-outline" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Time/Clock Button */}
          <TouchableOpacity
            style={{ width: scale(44), height: verticalScale(44) }}
            className="rounded-full items-center justify-center bg-[#319FCA] "
          >
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {/* <View className="flex-row mt-[3%] mx-[6%] justify-between">
        <Text className="font-poppins-semiBold text-base text-[#6B7280]">
          Booking Hours
        </Text>
        <Text className="font-poppins-400regular text-base text-[#565656]">
          {provider.price}/hr
        </Text>
      </View> */}
    </View>
  );
}
