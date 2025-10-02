import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-gifted-charts";
import { LogBox } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
export default function EarningsTrendChart() {
  // Ignore specific warnings
  LogBox.ignoreLogs(["setLayoutAnimationEnabledExperimental"]);
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const periods = ["This Week", "Last Week", "This Month", "Last Month"];

  const data = [
    { value: 8000, label: "Mon", frontColor: "#FFD700" },
    { value: 12000, label: "Tue", frontColor: "#FFD700" },
    { value: 15000, label: "Wed", frontColor: "#FFD700" },
    { value: 18000, label: "Thu", frontColor: "#FFD700" },
    { value: 22000, label: "Fri", frontColor: "#FFD700" },
    { value: 26000, label: "Sat", frontColor: "#FFD700" },
    { value: 20000, label: "Sun", frontColor: "#FFD700" },
  ];

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
              data={data}
              width={scale(280)}
              height={verticalScale(200)}
              barWidth={scale(28)}
              barBorderRadius={scale(4)}
              spacing={scale(22)}
              noOfSections={3}
              maxValue={30000}
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
                return (parseInt(value) / 1000).toString();
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
