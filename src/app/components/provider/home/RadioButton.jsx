import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { Text } from "react-native";

const RadioButton = ({ radioButtonChange, isAvailable }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    if (typeof radioButtonChange === "function") {
      radioButtonChange(value === "yes"); // convert to boolean
    }
  };

  return (
    <View className="px-[5%] py-[2%]">
      <View className="flex-row gap-[8%]">
        {/* Yes Option */}
        <TouchableOpacity
          className="items-center"
          onPress={() => handleSelect("yes")}
        >
          <View
            style={{ width: scale(20), height: verticalScale(20) }}
            className={`rounded-full bg-[#f9f9f9] border items-center justify-center ${
              selected === "yes" ? "border-[#319FCA]" : ""
            }`}
          >
            {selected === "yes" && (
              <View
                style={{ width: scale(18), height: verticalScale(18) }}
                className="rounded-full bg-[#319FCA]"
              />
            )}
          </View>
          <Text className="text-xs font-poppins-400regular mt-[2%] text-gray-800">
            Yes
          </Text>
        </TouchableOpacity>

        {/* No Option */}
        <TouchableOpacity
          className="items-center"
          onPress={() => handleSelect("no")}
        >
          <View
            style={{ width: scale(20), height: verticalScale(20) }}
            className={`rounded-full bg-[#f9f9f9] border items-center justify-center ${
              selected === "no" ? "border-[#319FCA]" : ""
            }`}
          >
            {selected === "no" && (
              <View
                style={{ width: scale(18), height: verticalScale(18) }}
                className="rounded-full bg-[#319FCA]"
              />
            )}
          </View>
          <Text className="text-xs font-poppins-400regular mt-[2%] text-gray-800">
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RadioButton;
