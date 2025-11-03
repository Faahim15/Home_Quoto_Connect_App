import { View } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import ViewAllServiceCards from "../components/tabs/home/services/ViewAllServices";
import { useLocalSearchParams } from "expo-router";
import {
  useGetActiveJobsQuery,
  useGetTodaysJobsQuery,
} from "../../redux/features/apiSlices/user/createJobSlices";

export default function HomeServiceScreen() {
  const { title } = useLocalSearchParams();

  const {
    data: todaysJobs,
    isLoading: todaysJobsLoading,
    error: todaysJobsError,
  } = useGetTodaysJobsQuery();

  const {
    data: activeJobs,
    isLoading: activeJobsLoading,
    error: activeJobsError,
  } = useGetActiveJobsQuery();

  // Determine which data to use based on title
  const isTodaysJob = title?.toLowerCase() === "today's job";
  const serviceData = isTodaysJob
    ? todaysJobs?.data?.jobs
    : activeJobs?.data?.jobs;
  const isLoading = isTodaysJob ? todaysJobsLoading : activeJobsLoading;
  const error = isTodaysJob ? todaysJobsError : activeJobsError;
  // console.log("todays jb:", todaysJobs?.data?.jobs[0].client);
  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="px-[6%]">
        <CustomTitle title={title} />
      </View>
      <ViewAllServiceCards
        servicesData={serviceData}
        isLoading={isLoading}
        error={error}
      />
    </View>
  );
}
