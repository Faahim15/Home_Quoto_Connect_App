import { View, Text, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { useState } from "react";

export default function Specializations({ onChange }) {
  // Change this to include IDs
  const specializations = [
    { id: "68fc5b1a31d8e408017d8258", title: "Residential" },
    { id: "68fc58a131d8e408017d8250", title: "Commercial" },
    { id: "68fc5b1a31d8e408017d8259", title: "HVAC" },
    { id: "68fc5b1a31d8e408017d8260", title: "Lighting" },
    { id: "68fc5b1a31d8e408017d8261", title: "Repair" },
    { id: "68fc5b1a31d8e408017d8262", title: "Home Installations" },
  ];
  
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  
  const toggleSelection = (index) => {
    let updatedIndexes;
    if (selectedIndexes.includes(index)) {
      updatedIndexes = selectedIndexes.filter((i) => i !== index);
    } else {
      updatedIndexes = [...selectedIndexes, index];
    }

    setSelectedIndexes(updatedIndexes);

    // Send IDs instead of titles
    const selectedIds = updatedIndexes.map((i) => specializations[i].id);
    onChange("specializations", selectedIds);
  };

  return (
    <View className="mt-[3%]">
      <Text className="font-poppins-semiBold text-base text-[#6B7280] ">
        Specializations
      </Text>
      <View className="flex-row flex-wrap gap-[3%] mt-[3%] ">
        {specializations.map((spec, idx) => {
          const isSelected = selectedIndexes.includes(idx);
          return (
            <TouchableOpacity
              onPress={() => toggleSelection(idx)}
              style={{
                height: verticalScale(35),
                marginBottom: verticalScale(3),
              }}
              className={` border rounded-md border-[#D4E0EB] px-[3%] py-[3%] items-center justify-center ${isSelected ? "bg-[#319FCA] " : "bg-white"} `}
              key={idx}
            >
              <Text
                className={`font-poppins-500medium text-xs  ${isSelected ? "text-white" : "text-[#175994]"} `}
              >
                {spec.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}