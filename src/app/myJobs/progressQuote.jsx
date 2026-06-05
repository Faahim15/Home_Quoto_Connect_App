import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { scale } from "../components/adaptive/Adaptiveness";
import XStyle from "../util/styles";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import CustomTitle from "../components/shared/CustomTitle";
import QuoteProgressDetails from "../components/tabs/myJobs/QuoteProgressDetails";
import PaymentMethodModal from "../components/shared/modal/PaymentMethodModal";
import { useState, useCallback } from "react";
import BotttomButtons from "../components/shared/services/buttons/BottomButtons";
import CancelModal from "../components/shared/modal/CancelModal";
import {
  useCancelJobMutation,
  useGetSingleJobQuery,
} from "../../redux/features/apiSlices/user/createJobSlices";
import { useQuoteById } from "../../hooks/useQuoteById";
import { toast } from "sonner-native";
import { Image } from "expo-image";

export default function ProgressQuote() {
  const { jobId, quoteId } = useLocalSearchParams();
  const [showPayment, setShowPayment] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelJob, { isLoading: cancelLoading }] = useCancelJobMutation();
  const { data, isLoading, error, refetch } = useGetSingleJobQuery(jobId);
  const item = data?.data?.job;
  const quote = useQuoteById(item?.quotes, quoteId);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading || cancelLoading) {
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
        <CustomTitle title="Service not found" withSafeTop={true} />
        <Text className="text-gray-500 text-base mt-[2%]">
          We couldn't locate the service details. Please check the link or try
          again later.
        </Text>
      </View>
    );
  }

  const handleCancelConfirm = async (reason) => {
    try {
      const res = await cancelJob({
        jobId,
        reason,
      }).unwrap();

      toast.success("Your service has been cancelled successfully.");

      setCancelModalVisible(false);
      router.back();
    } catch (err) {
      toast.error(err?.message || "Please try again.");
    }
  };

  const renderButton = (
    <>
      <BotttomButtons
        onPress={() => setCancelModalVisible(true)}
        backgroundColor="#fff"
        color="#EF4444"
        borderColor="#EF4444"
        title="Cancel"
      />
      <BotttomButtons
        onPress={() => setShowPayment(true)}
        backgroundColor="#18649F"
        color="#fff"
        borderColor="#18649F"
        title="Pay Now"
      />
    </>
  );

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="mb-[2%]">
        <CustomTitle title="Quote Details" withSafeTop={true} />
      </View>
      <ScrollView>
        <QuoteProgressDetails showStatus={true} job={item} quote={quote} />
      </ScrollView>

      {quote?.status !== "updated" && (
        <View
          className="flex-row w-full gap-[6%] h-[10%] border border-[#D8DCE0] justify-center items-center"
          style={[
            XStyle.shadowBox,
            {
              borderTopRightRadius: scale(20),
              width: "100%",
              borderTopLeftRadius: scale(20),
            },
          ]}
        >
          {renderButton}
        </View>
      )}
      <CancelModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
      />

      <PaymentMethodModal
        visible={showPayment}
        jobId={jobId}
        onClose={() => setShowPayment(false)}
      />
    </View>
  );
}
