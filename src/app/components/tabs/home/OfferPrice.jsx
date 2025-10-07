import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "../../adaptive/Adaptiveness";
export default function OfferPrice({ verticalPadding = 10 }) {
  const [price, setPrice] = useState(0);

  const increasePrice = () => setPrice((prev) => prev + 1);
  const decreasePrice = () => setPrice((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <View className="">
      <TextInput
        style={{ paddingVertical: verticalScale(verticalPadding) }}
        keyboardType="numeric"
        value={price.toString()}
        onChangeText={(text) => setPrice(Number(text) || 0)}
        placeholderTextColor="#898989"
        className="font-poppins-400regular text-sm  px-[14%]  mt-[1%] bg-[#f9f9f9] text-black border border-[#dcdcdc] rounded pr-[20%]"
      />

      {/* Gorgeous Up Arrow */}
      <TouchableOpacity
        onPress={increasePrice}
        className="absolute right-[3%] top-[2%] p-[3%] rounded-full "
      >
        <Ionicons name="caret-up-circle" size={18} color="#2583B6" />
      </TouchableOpacity>

      {/* Gorgeous Down Arrow */}
      <TouchableOpacity
        onPress={decreasePrice}
        className="absolute right-[3%] bottom-[0%]  p-[3%] rounded-full"
      >
        <Ionicons name="caret-down-circle" size={18} color="#2583B6" />
      </TouchableOpacity>
    </View>
  );
}
