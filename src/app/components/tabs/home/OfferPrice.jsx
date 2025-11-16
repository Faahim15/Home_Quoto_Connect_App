import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "../../adaptive/Adaptiveness";
export default function OfferPrice({
  value,
  onChange,
  verticalPadding = 10,
  isPersonalized,
}) {
  const increasePrice = () => onChange(value + 1);
  const decreasePrice = () => onChange(value > 0 ? value - 1 : 0);

  return (
    <View>
      <TextInput
        style={{ paddingVertical: verticalScale(verticalPadding) }}
        keyboardType="numeric"
        value={value}
        editable={!isPersonalized}
        onChangeText={(text) => onChange(Number(text) || 0)}
        placeholderTextColor="#898989"
        className="font-poppins-400regular text-sm  px-[14%] mt-[1%] bg-[#f9f9f9] text-black border border-[#dcdcdc] rounded pr-[20%]"
      />

      <TouchableOpacity
        onPress={increasePrice}
        disabled={isPersonalized}
        className="absolute right-[3%] top-[2%] p-[3%] rounded-full"
      >
        <Ionicons name="caret-up-circle" size={18} color="#2583B6" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={decreasePrice}
        disabled={isPersonalized}
        className="absolute right-[3%] bottom-[0%] p-[3%] rounded-full"
      >
        <Ionicons name="caret-down-circle" size={18} color="#2583B6" />
      </TouchableOpacity>
    </View>
  );
}
