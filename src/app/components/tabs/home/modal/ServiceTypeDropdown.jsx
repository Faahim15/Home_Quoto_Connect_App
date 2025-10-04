import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ServiceTypeDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const serviceTypes = [
    { id: "1", name: "Wiring" },
    { id: "2", name: "Repairs" },
    { id: "3", name: "Emergency" },
    { id: "4", name: "Installations" },
    { id: "5", name: "Plumber" },
  ];

  const handleSelectService = (service) => {
    setSelectedService(service);
    setIsOpen(false);
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      className="px-[6%] py-[3%] border-b border-gray-200"
      onPress={() => handleSelectService(item)}
    >
      <Text className="text-base text-gray-800">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="w-[100%]  pt-[3%]">
      <Text className="font-poppins-semiBold pb-[2%] text-base text-[#6B7280] ">
        Service Types
      </Text>

      <TouchableOpacity
        className="w-[100%] px-[4%] py-[3.5%] bg-[#f9f9f9] border border-gray-300 rounded-lg flex-row justify-between items-center"
        onPress={() => setIsOpen(true)}
      >
        <Text
          className={`font-poppins-500medium text-xs  ${selectedService ? "text-gray-800" : "text-[#175994]"}`}
        >
          {selectedService ? selectedService.name : "Select a service"}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setIsOpen(false)}
        >
          <View className="w-[90%] bg-white rounded-md overflow-hidden max-h-[60%]">
            <View className="px-[6%] py-[4%] bg-gray-50 border-b border-gray-200">
              <Text className="text-lg font-poppins-semiBold text-gray-800">
                Select Service Type
              </Text>
            </View>

            <FlatList
              data={serviceTypes}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id}
              className="max-h-[80%]"
            />

            <TouchableOpacity
              className="px-[6%] py-[4%] bg-gray-50 border-t border-gray-200"
              onPress={() => setIsOpen(false)}
            >
              <Text className="text-center text-base font-poppins-500medium text-blue-600">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
