import { View, Text, Pressable } from "react-native";
import { scale } from "../../../adaptive/Adaptiveness";

export default function BotttomButtons({
  title,
  backgroundColor,
  borderColor,
  color,
  width = 148,
  onPress,
  disabled,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: scale(width),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: scale(1),
      }}
      disabled={disabled}
      className=" justify-center  rounded-md items-center px-[3%] py-[3%] "
    >
      <Text style={{ color: color }} className="font-poppins-bold text-base  ">
        {title}
      </Text>
    </Pressable>
  );
}
