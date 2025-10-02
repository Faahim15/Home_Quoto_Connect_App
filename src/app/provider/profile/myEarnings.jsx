import { View, Text, ScrollView } from "react-native";
import React from "react";
import BookingStatsCard from "../../components/provider/profile/BookingStatCards";
import CustomTitle from "../../components/shared/services/CustomTitle";
import earningsOptions, {
  periodOptions,
} from "../../components/data/profile/EarningsData";
import EarningsTrendChart from "../../components/provider/profile/EarningTrendChart";
import ChartHeader from "../../components/provider/profile/ChartHeader";
import BookingsTrendChart from "../../components/provider/profile/BookingTrendChart";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
export default function myEarnings() {
  return (
    <View className="flex-1 px-[6.4%] bg-[#f9f9f9] ">
      <CustomTitle title="My Earnings" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(40) }}
        showsVerticalScrollIndicator={false}
      >
        <BookingStatsCard
          title="Total Bookings"
          periodOptions={periodOptions}
        />
        <View className="mt-[3%]">
          <BookingStatsCard
            title="Total Earnings"
            periodOptions={earningsOptions}
          />
        </View>
        <ChartHeader title="Earnings Trend" />
        <EarningsTrendChart />
        <ChartHeader title="Booking Trend" />
        <BookingsTrendChart />
      </ScrollView>
    </View>
  );
}
