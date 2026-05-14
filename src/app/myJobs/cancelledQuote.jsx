import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import CustomTitle from "../components/shared/CustomTitle";
import QuoteProgressDetails from "../components/tabs/myJobs/QuoteProgressDetails";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import { useQuoteById } from "../../hooks/useQuoteById";

export default function ProgressQuote() {
  const { jobId, quoteId } = useLocalSearchParams();

  const { data, isLoading, error, refetch } = useGetSingleJobQuery(jobId);
  const item = data?.data?.job;
  const quote = useQuoteById(item?.quotes, quoteId);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9]">
        <ActivityIndicator size="large" color="#4B5563" />
        <Text className="text-gray-500 text-base mt-2">
          Loading job details...
        </Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9] px-[6%]">
        <CustomTitle title="Service not found" />
        <Text className="text-gray-500 text-base mt-[2%]">
          We couldn't locate the service details. Please check the link or try
          again later.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="mb-[2%]">
        <CustomTitle title="Quote Details" withSafeTop={true} />
      </View>
      <ScrollView>
        <QuoteProgressDetails showStatus={true} quote={quote} job={item} />
      </ScrollView>
    </View>
  );
}
