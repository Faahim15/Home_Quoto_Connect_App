import { View, ScrollView, ActivityIndicator } from "react-native";
import HomeTopBar from "../components/tabs/home/HomeTopBar";
import PromoCard from "../components/tabs/home/PromoCard";
import ServiceCards from "../components/shared/services/ServiceCards";
import PopularServices from "../components/tabs/home/services/PopulareServices";
import ServiceProvider from "../components/tabs/home/services/ServiceProvider";
import ServiceHeader from "../components/tabs/home/ServiceHeader";
import { useUserProfileQuery } from "../../redux/features/apiSlices/user/userApiSlices";
import {
  useGetTodaysJobsQuery,
  useGetActiveJobsQuery,
  useGetServiceCategoriesQuery,
} from "../../redux/features/apiSlices/user/createJobSlices";
import { Text } from "react-native";

export default function HomeScreen() {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfileQuery();
  const { data: todaysJobs, isLoading: todaysJobsLoading } =
    useGetTodaysJobsQuery();
  const { data: activeJobs, isLoading: activeJobsLoading } =
    useGetActiveJobsQuery();

  const { data, isLoading, error } = useGetServiceCategoriesQuery();

  // ✅ Combined loading state
  if (profileLoading || todaysJobsLoading || activeJobsLoading || isLoading) {
    return (
      <View className="flex-1 bg-[#F9FAFB] justify-center items-center">
        <View className="flex-col items-center justify-center">
          <ActivityIndicator
            size="large"
            color="#175994"
            style={{ marginBottom: 16 }}
          />
          <Text className="font-poppins-500medium text-base text-[#565656]">
            Loading...
          </Text>
        </View>
      </View>
    );
  }

  if (profileError) {
    return (
      <View className="flex-1 bg-[#F9FAFB] justify-center items-center px-6">
        <View className="flex-col items-center justify-center">
          <Text className="font-poppins-500medium text-lg text-red-500 mb-2">
            Unable to Load Data
          </Text>
          <Text className="font-poppins-400regular text-sm text-[#6B7280] text-center">
            Please check your connection and try again
          </Text>
        </View>
      </View>
    );
  }

  const userData = profile?.data?.user;

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <HomeTopBar userData={userData} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 h-full"
      >
        <PromoCard />

        {/* Today's Jobs section */}
        <ServiceHeader title="Today's Jobs" />
        <ServiceCards
          jobs={todaysJobs?.data?.jobs}
          showPrice={true}
          showAddress={true}
          whichJob="todaysJob"
        />

        {/* Active Jobs section */}
        <ServiceHeader title="Active Jobs" />
        <ServiceCards
          jobs={activeJobs?.data?.jobs}
          showPrice={true}
          showAddress={true}
          whichJob="active job"
        />

        {/* popular service */}
        <PopularServices categories={data?.data?.categories} />

        {/* Popular Service Provider section */}
        <ServiceProvider />
      </ScrollView>
    </View>
  );
}
