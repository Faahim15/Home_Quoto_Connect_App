// ============================================
// ApplyFilterButton.js - MINIMAL FIX
// ============================================
import { View, Text, TouchableOpacity } from "react-native";

export default function ApplyFilterButton({ onPress }) {
  return (
    <TouchableOpacity
      className="bg-[#175994] rounded-lg px-4 py-3 border border-[#0054A5]"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className="text-white font-poppins-bold text-base text-center">
        Apply Filter
      </Text>
    </TouchableOpacity>
  );
}
