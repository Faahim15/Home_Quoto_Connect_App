import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import BookingStatsCard from "../../components/provider/profile/BookingStatCards";
import { periodOptions } from "../../components/data/profile/EarningsData";
import EarningsTrendChart from "../../components/provider/profile/EarningTrendChart";
import ChartHeader from "../../components/provider/profile/ChartHeader";
import BookingsTrendChart from "../../components/provider/profile/BookingTrendChart";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
import { useGetWalletQuery } from "../../../redux/features/apiSlices/payment/paymentApiSlice";
import CustomTitle from "../../components/shared/CustomTitle";
export default function MyEarnings() {
  const { data, isLoading, error } = useGetWalletQuery();


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


  const hasData =
    data?.data?.statistics && Object.keys(data.data.statistics).length > 0;

  if (!hasData) {
    return (
      <View className="flex-1 bg-[#f9f9f9]">
        <View className="px-[6.4%]">
          <CustomTitle title="My Earnings" />
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center mb-4">
              <Text className="text-4xl">📊</Text>
            </View>

            <Text className="text-xl font-poppins-600semibold text-[#2C2C2C] text-center mb-2">
              No Earnings Yet
            </Text>

            <Text className="text-[#5C5F62] text-center font-poppins-400regular leading-6">
              Your earnings data will appear here once you start receiving
              bookings. Complete your profile and offer your services to get
              started.
            </Text>
          </View>
        </View>
      </View>
    );
  }


  return ( 

    <>
    <CustomTitle title="My Earnings" withSafeTop={true} />
    <View className="flex-1 px-[6.4%] mt-[3%] bg-[#f9f9f9]">
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
  
    </> 
    );
}
