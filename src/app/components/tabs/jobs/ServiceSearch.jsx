import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Error from "../../shared/error/Error";

export default function ServiceSearch({
  error,
  selectedService,
  onSelectService,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState("");

  const services = [
    { id: "69019313b85c6ae3cd3c53d5", name: "Electrician" },
    { id: "69019313b85c6ae3cd3c53d6", name: "Plumber" },
    { id: "69019313b85c6ae3cd3c53d7", name: "Carpenter" },
    { id: "69019313b85c6ae3cd3c53d8", name: "Electrical Repair" },
    { id: "69019313b85c6ae3cd3c53d9", name: "Electrical Installation" },
  ];

  const selectService = (service) => {
    setSelectedServiceName(service.name);
    setIsOpen(false);
    onSelectService("serviceCategory", service.id);
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      onPress={() => selectService(item)}
      className="px-[6%] py-[4%] border-b border-gray-100"
    >
      <Text className="text-base text-gray-700 font-medium">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="px-[6%] bg-[#f9f9f9] py-[4%]">
      <Text className="text-base font-poppins-400regular text-[#1F2937] mb-[4%]">
        What Service do you need?
      </Text>

      <View className="relative">
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          className="flex-row items-center bg-[#f9f9f9] rounded-lg px-[4%] py-[3%] border border-[#D4E0EB]"
        >
          <Ionicons name="search" size={20} color="#6B7280" />
          <Text
            className={`flex-1 ml-[3%] text-sm ${selectedServiceName ? "text-black" : "text-[#6B7280]"}`}
          >
            {selectedServiceName || "Search for a service..."}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>
        <Error error={error} />
      </View>

      {isOpen && (
        <View className="mt-[2%] bg-white border border-gray-200 rounded-lg shadow-sm">
          <FlatList
            data={services}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            maxHeight={200}
          />
        </View>
      )}
    </View>
  );
}
