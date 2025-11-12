import { View, ScrollView, RefreshControl } from "react-native";
import { useState } from "react";
import CustomTitle from "../components/shared/CustomTitle";
import ViewAllServiceCards from "../components/tabs/home/services/ViewAllServices";
import { useLocalSearchParams } from "expo-router";
import {
  useGetActiveJobsQuery,
  useGetTodaysJobsQuery,
} from "../../redux/features/apiSlices/user/createJobSlices";

export default function HomeServiceScreen() {
  const { title } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: todaysJobs,
    isLoading: todaysJobsLoading,
    error: todaysJobsError,
    refetch: refetchTodaysJobs,
  } = useGetTodaysJobsQuery();

  const {
    data: activeJobs,
    isLoading: activeJobsLoading,
    error: activeJobsError,
    refetch: refetchActiveJobs,
  } = useGetActiveJobsQuery();

  // Determine which data to use based on title
  const isTodaysJob = title?.toLowerCase() === "today's job";
  const serviceData = isTodaysJob
    ? todaysJobs?.data?.jobs
    : activeJobs?.data?.jobs;
  const isLoading = isTodaysJob ? todaysJobsLoading : activeJobsLoading;
  const error = isTodaysJob ? todaysJobsError : activeJobsError;

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (isTodaysJob) {
        await refetchTodaysJobs();
      } else {
        await refetchActiveJobs();
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="px-[6%]">
        <CustomTitle title={title} />
      </View>
      <ViewAllServiceCards
        servicesData={serviceData}
        isLoading={isLoading}
        error={error}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}
