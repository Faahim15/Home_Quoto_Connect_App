import { Text, TouchableOpacity } from "react-native";

export default function ActionButton({
  color = "#fff",
  backgroundColor = "#0054A5",
  borderColor = "#0054A5",
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ backgroundColor: backgroundColor, borderColor: borderColor }}
      className="items-center border px-[4%] mb-[2%] py-[4%] rounded-md  justify-center "
    >
      <Text style={{ color: color }} className="font-poppins-bold text-base  ">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
