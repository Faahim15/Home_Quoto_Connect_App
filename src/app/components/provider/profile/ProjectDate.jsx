import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ProjectDate({ value, onDateChange }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Format date to DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event, selectedDate) => {
    // Close picker on Android after selection or dismissal
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    // If user cancelled (event.type === 'dismissed'), don't update
    if (event.type === "dismissed") {
      return;
    }

    // If a date was selected, call the parent's handler
    if (selectedDate && onDateChange) {
      onDateChange(selectedDate);
    }
  };

  const handleIOSConfirm = () => {
    setShowDatePicker(false);
  };

  return (
    <View className="mt-[0%]">
      <Text className="font-poppins-400regular text-base text-[#5C5F62]">
        Project Date
      </Text>
      <Pressable
        onPress={() => setShowDatePicker(true)}
        className="flex-row mt-[1.5%] items-center justify-between bg-white border border-gray-200 rounded-xl px-[4%] py-[4%]"
      >
        <Text
          className={`text-base ${value ? "text-[#898989]" : "text-gray-400"}`}
        >
          {value ? formatDate(value) : "DD/MM/YYYY"}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#898989" />
      </Pressable>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <>
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
          {/* iOS Done Button */}
          {Platform.OS === "ios" && (
            <Pressable
              onPress={handleIOSConfirm}
              className="bg-blue-500 rounded-lg px-4 py-2 mt-2 self-end"
            >
              <Text className="text-white font-medium">Done</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}
