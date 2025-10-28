import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ServiceSearch({ selectedService, onSelectService }) {
  const [searchText, setSearchText] = useState("Electri");
  const [suggestions, setSuggestions] = useState([
    "Electrician",
    "Electrical Repair",
    "Electrical Installation",
    "Electric Appliance Repair",
  ]);

  const services = [
    "Electrician",
    "Plumber",
    "Carpenter",
    "Cleaner",
    "Painter",
    "Gardener",
    "Mechanic",
    "Electrical Repair",
    "Electrical Installation",
    "Electric Appliance Repair",
    "Electronics Repair",
  ];

  const handleSearch = (text) => {
    setSearchText(text);
    onSelectService("serviceCategory", text);
    if (text.trim()) {
      const filtered = services.filter((service) =>
        service.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSuggestions([]);
  };

  const selectService = (service) => {
    setSearchText(service);
    setSuggestions([]);
    onSelectService("serviceCategory", service);
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      onPress={() => selectService(item)}
      className="px-[6%] py-[4%] border-b border-gray-100"
    >
      <Text className="text-base text-gray-700 font-medium">{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="px-[6%] bg-[#f9f9f9]  py-[4%]">
      {/* Title */}
      <Text className="text-base font-poppins-400regular text-[#1F2937] mb-[4%]">
        What Service do you need?
      </Text>

      {/* Search Input */}
      <View className="relative">
        <View className="flex-row items-center bg-[#f9f9f9] rounded-lg px-[4%] py-[3%] border border-[#D4E0EB]">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            value={searchText}
            onChangeText={handleSearch}
            placeholder="Search for a service..."
            placeholderTextColor="#6B7280"
            className="flex-1 ml-[3%] bg-[#f9f9f9]text-sm text-black"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              className="bg-blue-400 opacity-45 w-7 h-7 justify-center items-center rounded-full ml-[2%]"
            >
              <Ionicons name="close" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <View className="mt-[2%] bg-white border border-gray-200 rounded-lg shadow-sm">
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            maxHeight={200}
          />
        </View>
      )}

      {/* Popular Services */}
      {/* <View className="mt-[6%]">
        <Text className="text-base font-poppins-500medium text-gray-700 mb-[3%]">
          Popular Services
        </Text>
        <View className="flex-row flex-wrap">
          {["Electrician", "Plumber", "Cleaner", "Painter"].map(
            (service, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectService(service)}
                className="bg-blue-50 rounded-full px-[4%] py-[2%] mr-[2%] mb-[2%]"
              >
                <Text className="text-blue-600 text-sm font-poppins-500medium">
                  {service}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View> */}
    </View>
  );
}
