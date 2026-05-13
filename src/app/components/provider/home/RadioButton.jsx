import { useState, useEffect } from "react";
import { Pressable, View, Text } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

const RadioButton = ({ radioButtonChange, isAvailable }) => {
  const [selected, setSelected] = useState(
    isAvailable === null || isAvailable === undefined
      ? null
      : isAvailable
        ? "yes"
        : "no",
  );

  // ✅ Sync when isAvailable prop changes from parent
  useEffect(() => {
    if (isAvailable === null || isAvailable === undefined) return;
    setSelected(isAvailable ? "yes" : "no");
  }, [isAvailable]);

  const handleSelect = (value) => {
    setSelected(value);
    if (typeof radioButtonChange === "function") {
      radioButtonChange(value === "yes");
    }
  };

  return (
    <View className="px-[5%] py-[2%]">
      <View className="flex-row gap-[8%]">
        <Pressable className="items-center" onPress={() => handleSelect("yes")}>
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
        </Pressable>

        <Pressable className="items-center" onPress={() => handleSelect("no")}>
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
        </Pressable>
      </View>
    </View>
  );
};

export default RadioButton;
