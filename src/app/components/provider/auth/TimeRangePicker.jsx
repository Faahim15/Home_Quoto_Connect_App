import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function TimeRangePicker() {
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [showPicker, setShowPicker] = useState({ type: null, show: false });
  // console.log("show", fromTime, toTime);
  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      const updatedTime = selectedDate;
      if (showPicker.type === "from") setFromTime(updatedTime);
      else if (showPicker.type === "to") setToTime(updatedTime);
    }
    setShowPicker({ type: null, show: false });
  };

  const formatTime = (date) => {
    if (!date) return "HH:MM";
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    return `${h}:${m} ${ampm}`;
  };

  return (
    <View className="items-center justify-center bg-white px-[2%]">
      {/* From */}
      <View className="w-[90%] mb-[4%]">
        <Text className="text-gray-700 font-poppins-500medium mb-[0.5%]">
          From
        </Text>
        <TouchableOpacity
          onPress={() => setShowPicker({ type: "from", show: true })}
          className="border border-gray-300 rounded-md px-[3%] py-[4%]"
        >
          <Text className="text-gray-500">{formatTime(fromTime)}</Text>
        </TouchableOpacity>
      </View>

      {/* To */}
      <View className="w-[90%]">
        <Text className="text-gray-700 font-poppins-500medium mb-[0.5%]">
          To
        </Text>
        <TouchableOpacity
          onPress={() => setShowPicker({ type: "to", show: true })}
          className="border border-gray-300 rounded-md px-[3%] py-[4%]"
        >
          <Text className="text-gray-500">{formatTime(toTime)}</Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker */}
      {showPicker.show && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}
