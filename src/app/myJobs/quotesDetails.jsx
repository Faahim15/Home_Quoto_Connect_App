import { View, ScrollView } from "react-native";
import { scale } from "../components/adaptive/Adaptiveness";
import XStyle from "../util/styles";
import BotttomButtons from "../components/shared/services/buttons/BottomButtons";
import { router, useLocalSearchParams } from "expo-router";
import CustomTitle from "../components/shared/CustomTitle";
import QuoteReqDetails from "../components/tabs/myJobs/QuoteReqDetails";
import { toast } from "sonner-native";
import {
  useAcceptQuoteMutation,
  useCancelQuoteMutation,
} from "../../redux/features/apiSlices/quote/quoteApiSlice";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import { useGetMyJobsQuery } from "../../redux/features/apiSlices/user/createJobSlices";
export default function QuoteDetails() {
  const { quoteId, quoteReq } = useLocalSearchParams();

  const { data, isLoading, error } = useGetMyJobsQuery();
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
        (job) => Array.isArray(job.quotes) && job.quotes.length > 0,
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
    })),
  );

  const selectedQuoteItem = quoteItems.find(
    (item) => item.quote._id === quoteId,
  );
  const { quote } = selectedQuoteItem;

  // console.log("show quotes", selectedQuoteItem?.quote?.status);

  const quoteReqst = quoteReq === "true";

  const handleAcceptQuote = async () => {
    try {
      await acceptQuote({ id: quoteId }).unwrap();
      toast.success("You've successfully accepted the job.");
      router.back();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Accept error:", error);
    }
  };

  const handleDeclineQuote = async () => {
    try {
      await cancelQuote({ id: quoteId }).unwrap();
      toast.success("The provider has been notified of your decision.");
      router.back();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Decline error:", error);
    }
  };

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="mb-2">
        <CustomTitle title="Quote Details" withSafeTop={true} />
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
