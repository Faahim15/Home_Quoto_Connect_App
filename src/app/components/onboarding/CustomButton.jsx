import { Text, Pressable } from "react-native";
import { verticalScale } from "../adaptive/Adaptiveness";

export default function CustomButton({
  title,
  marginTop = 86,
  backgroundColor = "#0054A5",
  color = "#fff",
  onPress,
}) {
  return (
    <Pressable
      style={{
        marginTop: verticalScale(marginTop),
        backgroundColor: backgroundColor,
      }}
      onPress={onPress}
      className="mx-[6%]  border border-[#0054A5] rounded-md px-[3%] w-[90%]  py-[3%]"
    >
      <Text
        style={{ color: color }}
        className="font-poppins-bold text-base  text-center"
      >
        {title}
      </Text>
    </Pressable>
  );
}
