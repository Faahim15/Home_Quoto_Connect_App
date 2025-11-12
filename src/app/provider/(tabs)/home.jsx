import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import HomeTopBar from "../../components/tabs/home/HomeTopBar";
import { useState } from "react";
import FilterModal from "../../components/provider/home/FilteringModal";
import ShowAllServiceCards from "../../components/tabs/home/services/provider/showAllServices";
import SearchBar from "../../components/tabs/home/SearchBar";
import JobsHeader from "../../components/provider/home/JobsHeader";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
import { useUserProfileQuery } from "../../../redux/features/apiSlices/user/userApiSlices";
import {
  useGetActiveJobsQuery,
  useGetTodaysJobsQuery,
} from "../../../redux/features/apiSlices/user/createJobSlices";

export default function ContractorHomeScreen() {
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
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

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchProfile(),
        refetchTodaysJobs(),
        refetchActiveJobs(),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Combined loading state
  if (profileLoading || todaysJobsLoading || activeJobsLoading) {
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

  const userData = profile?.data?.user || null;

  function modalCloseHanlder() {
    setShowModal(false);
  }

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: verticalScale(40),
          backgroundColor: "#f9f9f9",
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#175994"]} // Android
            tintColor="#175994" // iOS
            progressBackgroundColor="#ffffff" // Android
          />
        }
      >
        <View>
          <HomeTopBar userData={userData} />
        </View>
        <SearchBar onPress={() => setShowModal(true)} />

        <JobsHeader title="Todays Jobs" />
        <View>
          <ShowAllServiceCards
            jobs={todaysJobs?.data?.jobs}
            horizontal={true}
          />
        </View>

        {/* Active jobs */}
        <JobsHeader title="Active Jobs" />
        <View>
          <ShowAllServiceCards
            jobs={activeJobs?.data?.jobs}
            horizontal={true}
          />
        </View>

        <FilterModal visible={showModal} onClose={modalCloseHanlder} />
      </ScrollView>
    </View>
  );
}
