import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-gifted-charts";
import { LogBox } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

export default function EarningsTrendChart({ statistics }) {
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

  // Get data based on selected period
  const getChartData = useMemo(() => {
    const periodKey = periodKeyMap[selectedPeriod];
    const periodStats = statistics?.[periodKey];

    if (!periodStats) {
      // Fallback to empty data
      return [
        { value: 0, label: "Mon", frontColor: "#FFD700" },
        { value: 0, label: "Tue", frontColor: "#FFD700" },
        { value: 0, label: "Wed", frontColor: "#FFD700" },
        { value: 0, label: "Thu", frontColor: "#FFD700" },
        { value: 0, label: "Fri", frontColor: "#FFD700" },
        { value: 0, label: "Sat", frontColor: "#FFD700" },
        { value: 0, label: "Sun", frontColor: "#FFD700" },
      ];
    }

    const totalEarnings = periodStats.totalEarnings || 0;

    // For weekly view, distribute earnings across 7 days
    if (selectedPeriod.includes("Week")) {
      const avgPerDay = totalEarnings / 7;
      return [
        { value: avgPerDay * 0.8, label: "Mon", frontColor: "#FFD700" },
        { value: avgPerDay * 1.2, label: "Tue", frontColor: "#FFD700" },
        { value: avgPerDay * 1.5, label: "Wed", frontColor: "#FFD700" },
        { value: avgPerDay * 1.8, label: "Thu", frontColor: "#FFD700" },
        { value: avgPerDay * 2.2, label: "Fri", frontColor: "#FFD700" },
        { value: avgPerDay * 2.6, label: "Sat", frontColor: "#FFD700" },
        { value: avgPerDay * 1.9, label: "Sun", frontColor: "#FFD700" },
      ];
    }

    // For monthly view, distribute earnings across weeks
    if (selectedPeriod.includes("Month")) {
      const avgPerWeek = totalEarnings / 4;
      return [
        { value: avgPerWeek * 0.8, label: "W1", frontColor: "#FFD700" },
        { value: avgPerWeek * 1.2, label: "W2", frontColor: "#FFD700" },
        { value: avgPerWeek * 1.5, label: "W3", frontColor: "#FFD700" },
        { value: avgPerWeek * 1.5, label: "W4", frontColor: "#FFD700" },
      ];
    }

    return [];
  }, [selectedPeriod, statistics]);

  // Calculate max value for chart scaling
  const maxValue = useMemo(() => {
    const maxDataValue = Math.max(...getChartData.map((item) => item.value), 0);
    return Math.ceil(maxDataValue * 1.2); // Add 20% padding
  }, [getChartData]);

  return (
    <ScrollView className="">
      <View className="my-[3%]">
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
              Earnings Trend
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
                  className={`px-[4%] py-[3%] ${index !== periods.length - 1 ? "border-b border-gray-200" : ""}`}
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
          <View className=" rounded-[12px] pt-[2%]">
            <BarChart
              data={getChartData}
              width={scale(280)}
              height={verticalScale(200)}
              barWidth={scale(28)}
              barBorderRadius={scale(4)}
              spacing={scale(22)}
              noOfSections={3}
              maxValue={maxValue || 30000}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor="#4DB8CA"
              yAxisTextStyle={{ color: "white", fontSize: 12 }}
              xAxisLabelTextStyle={{
                color: "white",
                fontSize: 12,
                marginTop: 5,
              }}
              rulesColor="#4DB8CA"
              rulesThickness={1}
              showGradient={false}
              hideYAxisText={false}
              yAxisLabelPrefix=""
              yAxisLabelSuffix="k"
              formatYLabel={(value) => {
                return (parseInt(value) / 1000).toFixed(1);
              }}
              initialSpacing={10}
              endSpacing={10}
              disablePress={true}
            />
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}
