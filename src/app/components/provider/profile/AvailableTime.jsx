import { View, Text, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

export default function AvailableTime({ label, time, onPress }) {
  return (
    <View>
      <Text className="font-poppins-500medium text-sm text-[#6B7280]">
        {label}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        style={{ width: scale(154), height: verticalScale(35) }}
        className="justify-center items-center rounded-md mt-[2%] border border-[#DCDCDC] bg-white"
      >
        <Text className="font-poppins-400regular text-sm text-[#6B7280]">
          {time || "Select time"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
