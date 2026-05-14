import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const IncidentTypeDropdown = ({ selectedIncident, setSelectedIncident }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const incidentTypes = [
    "Poor Performance",
    "Unprofessional Behavior",
    "No Show",
    "Quality Issues",
    "Communication Problems",
    "Other",
  ];

  const handleIncidentSelect = (incident) => {
    setSelectedIncident(incident);
    setIsDropdownOpen(false);
  };

  const renderIncidentItem = ({ item, index }) => (
    <Pressable
      className={`p-[4%] ${index !== incidentTypes.length - 1 ? "border-b border-gray-200" : ""}`}
      onPress={() => handleIncidentSelect(item)}
    >
      <Text className="text-base text-gray-800">{item}</Text>
    </Pressable>
  );

  return (
    <View className="mb-[6%]">
      <Text className="text-sm font-medium text-gray-700 mb-[2%]">
        Incident Type
      </Text>
      <View className="relative">
        {/* Dropdown Button */}
        <Pressable
          className="border border-gray-300 rounded-lg p-[4%] flex-row justify-between items-center"
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text
            className={`text-base ${selectedIncident ? "text-gray-800" : "text-gray-400"}`}
          >
            {selectedIncident || "Select here..."}
          </Text>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color="#9CA3AF"
          />
        </Pressable>

        {/* Dropdown Menu with FlatList */}
        {isDropdownOpen && (
          <View className="absolute top-full left-0 right-0 mt-[1%] bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-[200px]">
            <FlatList
              data={incidentTypes}
              renderItem={renderIncidentItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              bounces={false}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default IncidentTypeDropdown;
