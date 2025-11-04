import { View, Text } from "react-native";
import { scale, verticalScale } from "../../../../../adaptive/Adaptiveness";
export default function TimeSlot({ time }) {
  return (
    <View
      style={{ width: scale(60), height: verticalScale(30) }}
      className="bg-white justify-center border border-[#D4E0EB] items-center"
    >
      <Text className="font-poppins-500medium text-xs text-center text-[#565656] ">
        {time || "N/A"}
      </Text>
    </View>
  );
}
