import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { verticalScale } from "../../adaptive/Adaptiveness";
import { useState } from "react";

export default function ExperienceLevel() {
  const titles = ["1 year", "2 years", "4 years", "6+ years", "10+ years"];
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const toggleSelection = (index) => {
    setSelectedIndexes((prev) => (prev.includes(index) ? [] : [index]));
  };
  return (
    <View className="mt-[3%]">
      <Text className="font-poppins-semiBold text-base text-[#6B7280] ">
        Experience Level
      </Text>
      <View className="flex-row flex-wrap gap-[3%] mt-[3%] ">
        {titles.map((title, idx) => {
          const isSelected = selectedIndexes.includes(idx);
          return (
            <Pressable
              onPress={() => toggleSelection(idx)}
              style={{
                height: verticalScale(35),
                marginBottom: verticalScale(4),
              }}
              className={` border rounded-md border-[#D4E0EB] px-[3%] py-[3%] items-center justify-center ${isSelected ? "bg-[#319FCA] " : "bg-white"} `}
              key={idx}
            >
              <Text
                className={`font-poppins-500medium text-xs  ${isSelected ? "text-white" : "text-[#175994]"} `}
              >
                {title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
