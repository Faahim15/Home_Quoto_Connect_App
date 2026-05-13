import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { formatDateForDisplay } from "../../../../utils/dateUtils";

export default function TimePicker({ initialDate, initialTime }) {
  const jobData = useSelector((state) => state.jobPost);

  const selectedDate = jobData.preferredDate;
  const selectedTime = jobData.preferredTime;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return null;

    return timeString;
  };

  const displayDate = formatDateForDisplay(selectedDate);
  const displayTime = formatTime(selectedTime);

  return (
    <View className="mt-[3%]">
      <View className="flex-row justify-between items-center">
        <Text className="font-poppins-400regular text-base text-[#0F161C] mb-2">
          Time
        </Text>

        <Pressable
          onPress={() => router.push("/services/calenderBooking")}
          className="flex-row items-center gap-[3%]"
        >
          <Ionicons name="time-outline" color="#319FCA" size={20} />
          <Text className="font-poppins-bold text-base text-[#319FCA] underline">
            {selectedDate && selectedTime ? "Change time" : "Pick a time"}
          </Text>
        </Pressable>
      </View>

      {/* Display selected date and time */}
      {selectedDate && selectedTime && (
        <View className="mt-[2%] p-[3%] bg-white border border-[#D4E0EB] rounded-lg">
          <View className="flex-row items-center gap-[2%]">
            <Ionicons name="calendar-outline" color="#319FCA" size={18} />
            <Text className="font-poppins-500medium text-sm text-[#1F2937]">
              {displayDate}
            </Text>
            <Text className="text-[#6B7280]">•</Text>
            <Ionicons name="time-outline" color="#319FCA" size={18} />
            <Text className="font-poppins-500medium text-sm text-[#1F2937]">
              {displayTime}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
