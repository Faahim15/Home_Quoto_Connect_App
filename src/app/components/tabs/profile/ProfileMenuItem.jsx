import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import XStyle from "../../../util/styles";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { SvgXml } from "react-native-svg";
const ProfileMenuItem = ({ iconName, label, onPress, color = "#565656" }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="border mb-[3%] flex-row justify-between rounded-md border-[#D4E0EB]"
      style={[
        XStyle.shadowBox,
        {
          flexDirection: "row",
          alignItems: "center",
          height: verticalScale(60),
        },
      ]}
    >
      <View className="flex-row  items-center justify-center ">
        <SvgXml xml={iconName} height={verticalScale(30)} width={scale(34)} />
        <Text
          style={{ color: color, marginLeft: scale(12) }}
          className="font-poppins-500medium text-sm  "
        >
          {label}
        </Text>
      </View>
      <View
        style={{ width: scale(44), height: verticalScale(44) }}
        className=" bg-[#175994] rounded-md  items-center justify-center"
      >
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileMenuItem;
