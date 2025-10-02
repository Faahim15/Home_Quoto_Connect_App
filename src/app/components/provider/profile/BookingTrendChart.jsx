import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";
import { LogBox } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { LinearGradient } from "expo-linear-gradient";

export default function BookingsTrendChart() {
  // Ignore specific warnings
  LogBox.ignoreLogs(["setLayoutAnimationEnabledExperimental"]);

  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const periods = ["This Week", "Last Week", "This Month", "Last Month"];

  const data = [
    { value: 12, label: "Mon", dataPointColor: "white" },
    { value: 16, label: "Tue", dataPointColor: "white" },
    { value: 18, label: "Wed", dataPointColor: "white" },
    { value: 21, label: "Thu", dataPointColor: "white" },
    { value: 28, label: "Fri", dataPointColor: "white" },
    { value: 25, label: "Sat", dataPointColor: "white" },
    { value: 22, label: "Sun", dataPointColor: "white" },
  ];

  return (
    <ScrollView className="">
      <View className="mt-[3%]">
        {/* Card Container */}
        <LinearGradient
          colors={["#319FCA", "#18649F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: scale(20) }}
          className=" px-[6%] py-[5%] shadow-lg"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-[5%]">
            <Text className="font-poppins-semiBold text-sm text-white">
              Bookings Trend
            </Text>

            {/* Dropdown Button */}
            <TouchableOpacity
              className="bg-white rounded-full px-[6%] py-[2%] flex-row items-center min-w-[35%] justify-between"
              activeOpacity={0.8}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <Text className="font-poppins-400regular text-sm text-[#111827]">
                {selectedPeriod}
              </Text>
              <Ionicons
                name={dropdownOpen ? "chevron-up" : "chevron-down"}
                size={15}
                color="#1C1B1F"
              />
            </TouchableOpacity>
          </View>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <View className="absolute top-[60px] right-[6%] bg-white rounded-[8px] shadow-lg z-10 w-[38%]">
              {periods.map((period, index) => (
                <TouchableOpacity
                  key={index}
                  className={`px-[4%] py-[3%] ${
                    index !== periods.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                  onPress={() => {
                    setSelectedPeriod(period);
                    setDropdownOpen(false);
                  }}
                >
                  <Text className="text-gray-700 text-[13px]">{period}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Chart Container */}
          <View className=" pt-[2%]">
            <LineChart
              data={data}
              width={scale(250)} // Increase chart width
              height={verticalScale(180)}
              spacing={scale(45)}
              noOfSections={3}
              maxValue={30}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor="#5AB5CA"
              yAxisTextStyle={{ color: "white", fontSize: 12 }}
              xAxisLabelTextStyle={{
                color: "white",
                fontSize: 11,
                marginTop: verticalScale(5),
              }}
              rulesColor="#5AB5CA"
              rulesThickness={1}
              hideYAxisText={false}
              color="white"
              thickness={3}
              dataPointsColor="white"
              dataPointsRadius={5}
              curved={false}
              startFillColor="rgba(255, 255, 255, 0.3)"
              endFillColor="rgba(255, 255, 255, 0.05)"
              startOpacity={0.3}
              endOpacity={0.05}
              areaChart={true}
              hideDataPoints={false}
              initialSpacing={scale(10)}
              endSpacing={scale(10)}
              adjustToWidth={false}
            />
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}
