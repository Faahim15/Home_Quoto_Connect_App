import { View, Text, TextInput } from "react-native";
import { verticalScale } from "../../adaptive/Adaptiveness";

export default function MapTextField() {
  return (
    <View className="bg-[#fff] mt-[2%]">
      <TextInput
        className="text-black font-poppins-400regular bg-[#fff] border  rounded-md border-[#dcdcdc]  px-[2%] mt-[2%] "
        placeholder="Write here.."
        placeholderTextColor="#898989"
        multiline
        textAlignVertical="top"
        style={{ minHeight: verticalScale(100) }}
      />
    </View>
  );
}
