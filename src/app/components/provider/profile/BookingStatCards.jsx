import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../../util/styles";
export default function BookingStatsCard({
  periodOptions,
  title,
  statistics,
  mode,
}) {
  const [selectedPeriod, setSelectedPeriod] = useState("This month");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const selectedData = periodOptions.find(
    (option) => option.label === selectedPeriod
  );
  const { today, this_week, this_month, last_month, this_year, all_time } =
    statistics || {};

  const periodMap = {
    Today: today,
    "This week": this_week,
    "This month": this_month,
    "Last month": last_month,
    "This year": this_year,
    "All time": all_time,
  };

  const choosenData = periodMap[selectedData?.label] || "";

  const handleSelectPeriod = (period) => {
    setSelectedPeriod(period.label);
    setDropdownVisible(false);
  };

  return (
    <View className="w-full justify-center  items-center ">
      <LinearGradient
        colors={["#319FCA", "#18649F"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Header Row */}
        <View className="flex-row justify-between items-start mb-[4%]">
          <View className="">
            <Text className="font-poppins-400regular text-white text-sm  mb-[2%]">
              {title}
            </Text>
            <Text className="text-white font-poppins-bold text-3xl ">
              {mode === "earnings"
                ? choosenData?.totalEarnings
                : choosenData?.totalBookings || 0}
            </Text>
            <Text className="font-poppins-400regular text-white text-xs  mt-[3%]">
              {selectedPeriod}
            </Text>
          </View>

          {/* Dropdown Button */}
          <TouchableOpacity
            className="bg-white rounded-full px-[6%] py-[2%] flex-row items-center min-w-[35%] justify-between"
            activeOpacity={0.8}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text className="font-poppins-400regular text-xs text-[#1B1B1B] ">
              {selectedPeriod}
            </Text>
            <Ionicons
              name={dropdownVisible ? "chevron-up" : "chevron-down"}
              size={15}
              color="#1C1B1F"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center px-[6%]"
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View className="bg-white rounded-2xl w-full max-w-[90%] shadow-xl">
            <View className="px-[5%] py-[4%] border-b border-gray-200">
              <Text className="text-gray-800 text-lg font-semibold">
                Select Time Period
              </Text>
            </View>

            <FlatList
              data={periodOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`px-[5%] py-[4%] flex-row justify-between items-center border-b border-gray-100 ${
                    selectedPeriod === item.label ? "bg-blue-50" : "bg-white"
                  }`}
                  onPress={() => handleSelectPeriod(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-base ${
                      selectedPeriod === item.label
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Text>
                  {/* <Text className="text-gray-500 text-sm">
                    {item.bookings} bookings
                  </Text> */}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              className="px-[5%] py-[4%] items-center"
              onPress={() => setDropdownVisible(false)}
              activeOpacity={0.7}
            >
              <Text className="text-blue-600 text-base font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
