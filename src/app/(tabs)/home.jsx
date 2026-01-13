import {
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

// Components
import HomeTopBar from "../components/tabs/home/HomeTopBar";
import PromoCard from "../components/tabs/home/PromoCard";
import ServiceCards from "../components/shared/services/ServiceCards";
import PopularServices from "../components/tabs/home/services/PopulareServices";
import ServiceProvider from "../components/tabs/home/services/ServiceProvider";
import ServiceHeader from "../components/tabs/home/ServiceHeader";

// RTK Query Hooks
import { useUserProfileQuery } from "../../redux/features/apiSlices/user/userApiSlices";
import {
  useGetTodaysJobsQuery,
  useGetActiveJobsQuery,
  useGetServiceCategoriesQuery,
  useGetPopularProvidersQuery,
} from "../../redux/features/apiSlices/user/createJobSlices";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // ********** Redux API Calls **********
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useUserProfileQuery();

  const {
    data: todaysJobs,
    isLoading: todaysJobsLoading,
    refetch: refetchTodaysJobs,
  } = useGetTodaysJobsQuery();

  const {
    data: activeJobs,
    isLoading: activeJobsLoading,
    refetch: refetchActiveJobs,
  } = useGetActiveJobsQuery();

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    refetch: refetchCategories,
  } = useGetServiceCategoriesQuery();

  const {
    data: popularProvidersData,
    isLoading: providerLoading,
    refetch: refetchProviders,
  } = useGetPopularProvidersQuery();

  // ********** Pull to Refresh **********
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchProfile(),
        refetchTodaysJobs(),
        refetchActiveJobs(),
        refetchCategories(),
        refetchProviders(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  // ********** Global Loading **********
  const isGlobalLoading =
    profileLoading ||
    todaysJobsLoading ||
    activeJobsLoading ||
    categoriesLoading ||
    providerLoading;

  if (isGlobalLoading) {
    return (
      <View
        className="flex-1 bg-[#F9FAFB] justify-center items-center"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <ActivityIndicator size="large" color="#175994" />
        <Text className="mt-2 text-[#565656] font-poppins-500medium">
          Loading...
        </Text>
      </View>
    );
  }

  // ********** Error UI **********
  if (profileError) {
    return (
      <View
        className="flex-1 bg-[#F9FAFB] justify-center items-center px-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Text className="text-lg text-red-500 font-poppins-500medium">
          Unable to Load Data
        </Text>
        <Text className="text-sm text-[#6B7280] text-center mt-2 font-poppins-400regular">
          Please check your connection and try again.
        </Text>
      </View>
    );
  }

  // ********** Extract Data **********
  const userData = profile?.data?.user || null;
  const providerList = popularProvidersData?.data?.providers || [];
  const categoryList = categoriesData?.data?.categories || [];

  // ********** Render UI **********
  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <HomeTopBar mode="user" userData={userData} />

      <PromoCard />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#175994"]}
            tintColor="#175994"
          />
        }
      >
        {/* Today's Jobs */}
        <ServiceHeader title="Today's Jobs" />
        <ServiceCards
          jobs={todaysJobs?.data?.jobs || []}
          showPrice
          showAddress
          whichJob="todaysJob"
        />

        {/* Active Jobs */}
        <ServiceHeader title="Active Jobs" />
        <ServiceCards
          jobs={activeJobs?.data?.jobs || []}
          showPrice
          showAddress
          whichJob="active job"
        />

        {/* Popular Services */}
        <PopularServices categories={categoryList} />

        {/* Popular Providers */}
        <ServiceProvider providerData={providerList} />
      </ScrollView>
    </View>
  );
}
