import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { scale, verticalScale } from "../../../adaptive/Adaptiveness";

export default function SearchAndFilterBar({ onSearch, onFilterPress }) {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (text) => {
    setSearchText(text);
    onSearch(text); // Call API on every keystroke
  };

  const handleClearSearch = () => {
    setSearchText("");
    onSearch(""); // Clear search
  };

  return (
    <View className="flex-row items-center mx-[6%] mt-[3%] mb-[2%]">
      {/* Search Bar */}
      <View
        className="flex-1 flex-row items-center bg-white border border-[#D4E0EB] rounded-lg px-3"
        style={{ height: verticalScale(45) }}
      >
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          value={searchText}
          onChangeText={handleSearchChange}
          placeholder="Search providers..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 ml-2 font-poppins-regular text-sm text-[#565656]"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button */}
      <TouchableOpacity
        onPress={onFilterPress}
        className="ml-3 bg-[#0054A5] rounded-lg items-center justify-center"
        style={{ width: scale(45), height: verticalScale(45) }}
      >
        <Ionicons name="options-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
