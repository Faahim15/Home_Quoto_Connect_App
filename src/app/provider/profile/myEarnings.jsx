import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import BookingStatsCard from "../../components/provider/profile/BookingStatCards";
import CustomTitle from "../../components/shared/services/CustomTitle";
import earningsOptions, {
  periodOptions,
} from "../../components/data/profile/EarningsData";
import EarningsTrendChart from "../../components/provider/profile/EarningTrendChart";
import ChartHeader from "../../components/provider/profile/ChartHeader";
import BookingsTrendChart from "../../components/provider/profile/BookingTrendChart";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
import { useGetWalletQuery } from "../../../redux/features/apiSlices/payment/paymentApiSlice";

export default function MyEarnings() {
  const { data, isLoading, error } = useGetWalletQuery();

  // --------------------------------------------------
  // ⭐ Loading UI
  // --------------------------------------------------
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f9f9f9]">
        <ActivityIndicator size="large" color="#5C5F62" />
        <Text className="mt-3 font-poppins-500medium text-base text-[#5C5F62]">
          Loading your earnings...
        </Text>
      </View>
    );
  }

  // --------------------------------------------------
  // ⭐ Error UI
  // --------------------------------------------------
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f9f9f9] px-6">
        <Text className="text-red-500 text-lg font-poppins-500medium">
          Something went wrong
        </Text>
        <Text className="mt-1 text-[#5C5F62] text-center font-poppins-400regular">
          Failed to load earnings data. Please try again later.
        </Text>
      </View>
    );
  }

  // console.log("data", data?.data?.statistics?.today);

  return (
    <View className="flex-1 px-[6.4%] bg-[#f9f9f9]">
      <CustomTitle title="My Earnings" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(40) }}
        showsVerticalScrollIndicator={false}
      >
        <BookingStatsCard
          title="Total Bookings"
          periodOptions={periodOptions}
          statistics={data?.data?.statistics}
        />

        <View className="mt-[3%]">
          <BookingStatsCard
            title="Total Earnings"
            periodOptions={periodOptions}
            statistics={data?.data?.statistics}
            mode="earnings"
          />
        </View>

        <ChartHeader title="Earnings Trend" />
        <EarningsTrendChart statistics={data?.data?.statistics} />

        <ChartHeader title="Booking Trend" />
        <BookingsTrendChart statistics={data?.data?.statistics} />
      </ScrollView>
    </View>
  );
}
