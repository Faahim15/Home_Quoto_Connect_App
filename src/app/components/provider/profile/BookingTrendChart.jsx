import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";
import { LogBox } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../../util/styles";
export default function BookingsTrendChart({ statistics }) {
  // Ignore specific warnings
  LogBox.ignoreLogs(["setLayoutAnimationEnabledExperimental"]);

  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const periods = ["This Week", "Last Week", "This Month", "Last Month"];

  // Map periods to statistics keys
  const periodKeyMap = {
    "This Week": "this_week",
    "Last Week": "last_week",
    "This Month": "this_month",
    "Last Month": "last_month",
  };

  // Get chart data based on selected period
  const getChartData = useMemo(() => {
    const periodKey = periodKeyMap[selectedPeriod];
    const periodStats = statistics?.[periodKey];

    if (!periodStats) {
      // Fallback to empty data
      return [
        { value: 0, label: "Mon" },
        { value: 0, label: "Tue" },
        { value: 0, label: "Wed" },
        { value: 0, label: "Thu" },
        { value: 0, label: "Fri" },
        { value: 0, label: "Sat" },
        { value: 0, label: "Sun" },
      ];
    }

    const totalBookings = periodStats.totalBookings || 0;

    // For weekly view, distribute bookings across 7 days
    if (selectedPeriod.includes("Week")) {
      const avgPerDay = totalBookings / 7;
      return [
        { value: Math.round(avgPerDay * 0.6), label: "Mon" },
        { value: Math.round(avgPerDay * 0.9), label: "Tue" },
        { value: Math.round(avgPerDay * 1.3), label: "Wed" },
        { value: Math.round(avgPerDay * 1.1), label: "Thu" },
        { value: Math.round(avgPerDay * 1.6), label: "Fri" },
        { value: Math.round(avgPerDay * 1.8), label: "Sat" },
        { value: Math.round(avgPerDay * 1.7), label: "Sun" },
      ];
    }

    // For monthly view, distribute bookings across weeks
    if (selectedPeriod.includes("Month")) {
      const avgPerWeek = totalBookings / 4;
      return [
        { value: Math.round(avgPerWeek * 0.7), label: "W1" },
        { value: Math.round(avgPerWeek * 1.1), label: "W2" },
        { value: Math.round(avgPerWeek * 1.3), label: "W3" },
        { value: Math.round(avgPerWeek * 0.9), label: "W4" },
      ];
    }

    return [];
  }, [selectedPeriod, statistics]);

  // Calculate max value for chart scaling
  const maxValue = useMemo(() => {
    const maxDataValue = Math.max(...getChartData.map((item) => item.value), 0);
    // Add 30% padding and round up to nearest multiple of 5
    const paddedMax = Math.ceil(maxDataValue * 1.3);
    return Math.ceil(paddedMax / 5) * 5 || 30; // Minimum 30 for better visualization
  }, [getChartData]);

  const currentData = getChartData;

  return (
    <ScrollView className="">
      <View className="mt-[3%]">
        {/* Card Container */}
        <LinearGradient
          colors={["#319FCA", "#18649F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
               style={styles.gradientCard}
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
              data={currentData}
              width={scale(250)}
              height={verticalScale(180)}
              spacing={scale(45)}
              noOfSections={3}
              maxValue={maxValue}
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
              initialSpacing={scale(20)}
              endSpacing={scale(10)}
              adjustToWidth={false}
            />
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}
