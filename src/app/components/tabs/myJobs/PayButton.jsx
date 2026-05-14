import { View, Text, TouchableOpacity, Pressable } from "react-native";
import serviceColors from "../../../util/colors";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
export default function PayButton({ onPress, item }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: "100%", height: verticalScale(40) }}
      className={` justify-center items-center  mt-[3%] rounded-md py-[2%] px-[2%] ${serviceColors[item?.serviceType] || "bg-[#0054A5]"} `}
    >
      <Text className=" font-poppins-bold   text-white text-base ">
        Pay Now
      </Text>
    </Pressable>
  );
}
