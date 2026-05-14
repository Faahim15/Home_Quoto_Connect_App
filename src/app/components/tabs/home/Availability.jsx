import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

const Availability = () => {
  const [selectedOption, setSelectedOption] = useState("specific");

  return (
    <View className="mt-[3%]">
      {/* Options Container */}
      <View className="flex-row justify-between items-center gap-x-[4%]">
        {/* Electrician Urgently Option */}
        <Pressable
          onPress={() => setSelectedOption("urgent")}
          className={`flex-row items-center rounded-full px-[4%] py-[3%] ${
            selectedOption === "urgent" ? "bg-blue-500" : "bg-[#f9f9f9]"
          }`}
        >
          {/* Simple Radio Button or Checkmark */}
          {selectedOption === "urgent" ? (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="white"
              style={{ marginRight: scale(8) }}
            />
          ) : (
            <View
              style={{
                width: scale(18),
                height: verticalScale(18),
                marginRight: scale(8),
              }}
              className=" rounded-full border-2 border-gray-400"
            />
          )}

          <Text
            className={`text-sm font-poppins-500medium ${
              selectedOption === "urgent" ? "text-white" : "text-blue-500"
            }`}
          >
            Urgently
          </Text>
        </Pressable>

        {/* Specific Times Option */}
        <Pressable
          onPress={() => setSelectedOption("specific")}
          className={`flex-row items-center rounded-full px-[4%] py-[3%] ${
            selectedOption === "specific" ? "bg-blue-500" : "bg-[#f9f9f9]"
          }`}
        >
          {/* Simple Radio Button or Checkmark */}
          {selectedOption === "specific" ? (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="white"
              style={{ marginRight: scale(8) }}
            />
          ) : (
            <View
              style={{
                width: scale(18),
                height: verticalScale(18),
                marginRight: scale(8),
              }}
              className="rounded-full border-2 border-gray-400"
            />
          )}

          <Text
            className={`text-sm font-poppins-500medium ${
              selectedOption === "specific" ? "text-white" : "text-blue-500"
            }`}
          >
            specific time
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Availability;
