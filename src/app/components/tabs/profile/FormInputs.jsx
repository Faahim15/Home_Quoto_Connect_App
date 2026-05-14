import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const ProfileFormInputs = ({ formData, onInputChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format ISO date to DD/MM/YYYY
  const formatDateToDisplay = (isoDate) => {
    if (!isoDate) return "";

    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return "";

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // Set initial date from formData and format it
  useEffect(() => {
    if (formData?.dateOfBirth) {
      try {
        // Check if it's already in DD/MM/YYYY format
        if (formData.dateOfBirth.includes("/")) {
          const [day, month, year] = formData.dateOfBirth.split("/");
          const date = new Date(year, month - 1, day);
          if (!isNaN(date.getTime())) {
            setSelectedDate(date);
          }
        } else {
          // It's in ISO format (1999-01-01T00:00:00.000Z)
          const date = new Date(formData.dateOfBirth);
          if (!isNaN(date.getTime())) {
            setSelectedDate(date);
            // Format and update the display
            const formatted = formatDateToDisplay(formData.dateOfBirth);
            if (formatted && formatted !== formData.dateOfBirth) {
              onInputChange("dateOfBirth", formatted);
            }
          }
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }
  }, [formData?.dateOfBirth]);

  // Format phone number function
  const formatPhoneNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "");

    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);

    // Format with spaces: XXX XXX XXXX
    let formatted = limited;
    if (limited.length > 3) {
      formatted = limited.slice(0, 3) + " " + limited.slice(3);
    }
    if (limited.length > 6) {
      formatted =
        limited.slice(0, 3) +
        " " +
        limited.slice(3, 6) +
        " " +
        limited.slice(6);
    }

    return formatted;
  };

  // Handle phone number change
  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    onInputChange("phoneNumber", formatted);
  };

  // Handle date change
  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
      const formattedDate = formatDateToDisplay(selected.toISOString());
      onInputChange("dateOfBirth", formattedDate);
    }
  };

  return (
    <View className="">
      {/* Date of Birth */}
      <View className="mt-[1.5%]">
        <Text className="font-poppins-400regular text-base text-[#5C5F62]">
          Date of Birth
        </Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          className="flex-row mt-[1.5%] items-center justify-between bg-white border border-gray-200 rounded-xl px-[4%] py-[4%]"
        >
          <Text
            className={`text-base ${formData?.dateOfBirth ? "text-[#898989]" : "text-gray-400"}`}
          >
            {formData?.dateOfBirth || "DD/MM/YYYY"}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#898989" />
        </Pressable>
      </View>

      {/* Phone Number */}
      <View className="mt-[1.5%]">
        <Text className="font-poppins-400regular text-base text-[#5C5F62]">
          Phone number
        </Text>
        <View className="flex-row mt-[1.5%] bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Canadian Flag */}
          <View className="flex-row items-center px-[3%] py-[4%] border-r border-gray-200">
            <Text className="text-xl mr-[2%]">🇨🇦</Text>
            <Text className="text-base font-poppins-400regular text-[#898989]">
              +1
            </Text>
          </View>

          {/* Phone Input */}
          <TextInput
            value={formData?.phoneNumber || ""}
            onChangeText={handlePhoneChange}
            placeholder="XXX XXX XXXX"
            keyboardType="phone-pad"
            maxLength={12} // 10 digits + 2 spaces
            className="flex-1 px-[3%] py-[4%] text-base text-black font-poppins-400regular"
            placeholderTextColor="#898989"
          />
        </View>
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default ProfileFormInputs;
