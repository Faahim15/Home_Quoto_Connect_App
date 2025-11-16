import { View, ScrollView } from "react-native";
import { scale } from "../components/adaptive/Adaptiveness";
import XStyle from "../util/styles";
import BotttomButtons from "../components/shared/services/buttons/BottomButtons";
import { router, useLocalSearchParams } from "expo-router";
import CustomTitle from "../components/shared/services/CustomTitle";
import QuoteReqDetails from "../components/tabs/myJobs/QuoteReqDetails";
import Toast from "react-native-toast-message";
import { useGetAllJobsQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import {
  useAcceptQuoteMutation,
  useCancelQuoteMutation,
} from "../../redux/features/apiSlices/quote/quoteApiSlice";
export default function QuoteDetails() {
  const { quoteId, quoteReq } = useLocalSearchParams();

  const { data, isLoading, error } = useGetAllJobsQuery();
  const [acceptQuote, { isLoading: isAccepting }] = useAcceptQuoteMutation();
  const [cancelQuote, { isLoading: isDeclining }] = useCancelQuoteMutation();
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  // Extract jobs data with fallback
  const jobsData = data?.data?.jobs || data?.data || [];
  const quoteData = jobsData.length > 0 ? jobsData : null;

  // Filter jobs that have quotes
  const filteredQuotes = Array.isArray(quoteData)
    ? quoteData.filter(
        (job) => Array.isArray(job.quotes) && job.quotes.length > 0
      )
    : [];

  // Handle empty state
  if (filteredQuotes.length === 0) {
    return <EmptyState />;
  }
  const quoteItems = filteredQuotes.flatMap((job) =>
    job.quotes.map((quote) => ({
      quote,
      job, // preserve job context
    }))
  );

  const selectedQuoteItem = quoteItems.find(
    (item) => item.quote._id === quoteId
  );
  const { quote } = selectedQuoteItem;

  // console.log("show quotes", selectedQuoteItem?.quote?.status);

  const quoteReqst = quoteReq === "true";

  const handleAcceptQuote = async () => {
    try {
      await acceptQuote({ id: quoteId }).unwrap();

      Toast.show({
        type: "success",
        text1: "Job Accepted",
        text2: "You've successfully accepted the job.",
      });

      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to Accept",
        text2: "Something went wrong. Please try again.",
      });
      console.error("Accept error:", error);
    }
  };
  const handleDeclineQuote = async () => {
    try {
      await cancelQuote({ id: quoteId }).unwrap();

      Toast.show({
        type: "error",
        text1: "Request Declined",
        text2: "The provider has been notified of your decision",
        position: "top",
        visibilityTime: 3000,
      });

      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to Decline",
        text2: "Something went wrong. Please try again.",
      });
      console.error("Decline error:", error);
    }
  };
  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="px-[4%]">
        <CustomTitle title="Quote Details" />
      </View>
      <ScrollView>
        <QuoteReqDetails quoteReq={quoteReqst} item={selectedQuoteItem} />
      </ScrollView>

      {quote?.status === "pending" && (
        <View
          className="flex-row gap-[6%] h-[14%]  border border-[#D8DCE0] justify-center items-center "
          style={[
            XStyle.shadowBox,
            { borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20) },
          ]}
        >
          <BotttomButtons
            onPress={handleDeclineQuote}
            backgroundColor="#fff"
            color="#EF4444"
            borderColor="#EF4444"
            title={isDeclining ? "Declining..." : "Decline"}
            disabled={isDeclining}
          />

          <BotttomButtons
            onPress={handleAcceptQuote}
            backgroundColor="#18649F"
            color="#fff"
            borderColor="#18649F"
            title={isAccepting ? "Accepting..." : "Accept"}
            disabled={isAccepting}
          />
        </View>
      )}
    </View>
  );
}
