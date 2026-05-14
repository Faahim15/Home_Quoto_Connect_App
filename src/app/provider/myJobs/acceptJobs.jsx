import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useState } from "react";
import CustomTitle from "../../components/shared/CustomTitle";
import ProviderJobSummary from "../../components/tabs/jobs/ProviderJobSummary";
import BotttomButtons from "../../components/shared/services/buttons/BottomButtons";
import { router, useLocalSearchParams } from "expo-router";
import XStyle from "../../util/styles";
import { scale, verticalScale } from "../../components/adaptive/Adaptiveness";
import { useGetAllQuotesQuery } from "../../../redux/features/apiSlices/quote/quoteApiSlice";
import { Ionicons } from "@expo/vector-icons";
import CashConfirmModal from "../../components/shared/modal/CashConfirmModal";
import {
  useConfirmCashPaymentMutation,
  useGetTransactionByJobQuery,
} from "../../../redux/features/apiSlices/payment/paymentApiSlice";
import { toast } from "sonner-native";

export default function AcceptJobDetailScreen() {
  const { quoteId, jobId } = useLocalSearchParams();

  const [cashConfirmModalVisible, setCashConfirmModalVisible] = useState(false);

  // Fetch all quotes
  const { data, isLoading, error, refetch } = useGetAllQuotesQuery();

  // Fetch transaction by jobId
  const {
    data: transactionData,
    isLoading: transactionLoader,
    error: transactionError,
  } = useGetTransactionByJobQuery(jobId, { skip: !jobId });

  // Mutation for confirming cash payment
  const [confirmCashPayment, { isLoading: confirming }] =
    useConfirmCashPaymentMutation();

  const handleConfirmPayment = async () => {
    try {
      // 1️⃣ Check if transaction data exists
      const transactionId = transactionData?.data?.transaction?._id;

      if (!transactionId) {
        toast.error("Transaction not found.");
        return;
      }

      // 2️⃣ Check if already confirmed
      const alreadyConfirmed =
        transactionData?.data?.transaction?.cashPayment?.confirmedByProvider;

      if (alreadyConfirmed) {
        toast.info("Payment already confirmed.");
        setCashConfirmModalVisible(false);
        return;
      }

      // 3️⃣ Confirm cash payment
      await confirmCashPayment(transactionId).unwrap();

      toast.success("Payment confirmed.");

      setCashConfirmModalVisible(false);
      router.push("/provider/myJobs");
    } catch (err) {
      toast.error(err?.message || "Please try again.");
    }
  };

  // Loading UI
  if (isLoading || transactionLoader) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9]">
        <ActivityIndicator size="large" color="#175994" />
        <Text className="font-poppins-400regular text-sm text-gray-600 mt-4">
          Loading details...
        </Text>
      </View>
    );
  }

  // Error UI
  if (error || transactionError) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9] px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="font-poppins-600semiBold text-lg text-gray-900 mt-4 text-center">
          Failed to Load Information
        </Text>
        <Pressable
          onPress={refetch}
          className="mt-6 bg-[#175994] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-500medium text-white text-base">
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  const acceptedJob = data?.data?.quotes?.find((q) => q._id === quoteId) || {};

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      {/* Title */}
      <View className="">
        <CustomTitle
          title={acceptedJob?.job?.serviceCategory?.title || "Service Details"}
          withSafeTop={true}
        />
      </View>

      {/* Summary */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(50) }}
        className="px-[6%]"
      >
        <ProviderJobSummary
          quoteInfo={acceptedJob}
          showPaymentCheckList={true}
        />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View
        className="gap-[1%] border border-[#D8DCE0]"
        style={[
          XStyle.shadowBox,
          {
            borderTopRightRadius: scale(20),
            borderTopLeftRadius: scale(20),
          },
        ]}
      >
        <View className="flex-row gap-[6%] justify-center items-center">
          <BotttomButtons
            onPress={() => setCashConfirmModalVisible(true)}
            backgroundColor="#10B981"
            color="#fff"
            borderColor="#10B981"
            title="Confirm Payment"
            width={148}
            disabled={confirming}
          />

          <BotttomButtons
            onPress={() =>
              router.push({
                pathname: "/provider/quote/updateQuoteOffer",
                params: { jobId: jobId },
              })
            }
            backgroundColor="#175994"
            color="#fff"
            borderColor="#0054A5"
            title="Send Updated Quote"
            width={148}
          />
        </View>
      </View>

      {/* Cash Confirm Modal */}
      <CashConfirmModal
        visible={cashConfirmModalVisible}
        onClose={() => setCashConfirmModalVisible(false)}
        onConfirm={handleConfirmPayment}
        isLoading={confirming}
      />
    </View>
  );
}
