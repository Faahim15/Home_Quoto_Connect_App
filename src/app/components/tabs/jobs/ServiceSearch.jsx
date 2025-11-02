import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Error from "../../shared/error/Error";
import { useGetServiceCategoriesQuery } from "../../../../redux/features/apiSlices/user/createJobSlices";

export default function ServiceSearch({ error, onSelectService }) {
  const { data, isLoading } = useGetServiceCategoriesQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState("");

  const selectService = (service) => {
    setSelectedServiceName(service?.title);
    setIsOpen(false);
    onSelectService("serviceCategory", {
      id: service?._id,
      title: service?.title,
    });
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      key={item?._id}
      onPress={() => selectService(item)}
      className="px-[6%] py-[4%] border-b border-gray-100"
    >
      <Text className="text-base text-gray-700 font-medium">{item?.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="px-[6%] bg-[#f9f9f9]">
      <Text className="text-base font-poppins-400regular text-[#1F2937] mb-[4%]">
        What Service do you need?
      </Text>

      <View className="relative">
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          className="flex-row items-center bg-[#f9f9f9] rounded-lg px-[4%] py-[5%] border border-[#D4E0EB]"
        >
          <Text
            className={`flex-1 ml-[3%] text-sm ${
              selectedServiceName ? "text-black" : "text-[#6B7280]"
            }`}
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
          {isLoading ? (
            <View className="py-[6%] items-center justify-center">
              <ActivityIndicator size="small" color="#175994" />
              <Text className="text-xs text-gray-500 mt-[2%]">
                Loading services...
              </Text>
            </View>
          ) : (
            <FlatList
              data={data?.data?.categories}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 200 }}
            />
          )}
        </View>
      )}
    </View>
  );
}
