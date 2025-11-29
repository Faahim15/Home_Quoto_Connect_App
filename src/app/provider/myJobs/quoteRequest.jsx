import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import CustomTitle from "../../components/shared/CustomTitle";
import JobSummary from "../../components/tabs/jobs/JobSummary";
import XStyle from "../../util/styles";
import BotttomButtons from "../../components/shared/services/buttons/BottomButtons";
import { scale } from "../../components/adaptive/Adaptiveness";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import CancelModal from "../../components/shared/modal/CancelModal";
import { useState } from "react";
import Toast from "react-native-toast-message";
import {
  useAcceptOfferQuoteMutation,
  useGetAllQuotesQuery,
  useRemoveQuoteMutation,
} from "../../../redux/features/apiSlices/quote/quoteApiSlice";
import { Text } from "react-native";
// import { capitalizeFirstLetter } from "../../util/helper-function";
import { Ionicons } from "@expo/vector-icons";
import { capitalizeFirstLetter } from "../../util/helper-function";
export default function QuotesRequestDetailScreen() {
  const { quoteId, jobId } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useGetAllQuotesQuery();
  const [cancelJob, { isLoading: cancelLoading }] = useRemoveQuoteMutation();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  // ------------------------------------------
  // Loading State
  // ------------------------------------------
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9]">
        <ActivityIndicator size="large" color="#175994" />
        <Text className="font-poppins-400regular text-sm text-gray-600 mt-4">
          Loading quote details...
        </Text>
      </View>
    );
  }

  // ------------------------------------------
  // Error State
  // ------------------------------------------
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9] px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="font-poppins-600semiBold text-lg text-gray-900 mt-4 text-center">
          Unable to Load Quotes
        </Text>
        <Text className="font-poppins-400regular text-sm text-gray-600 mt-2 text-center">
          {error?.message || "Something went wrong. Please try again."}
        </Text>

        <TouchableOpacity
          onPress={refetch}
          className="mt-6 bg-[#175994] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-500medium text-white text-base">
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pendingJobs = data?.data?.quotes?.find((q) => q._id === quoteId) || [];

  // ---------------------------
  // Cancel Job
  // ---------------------------
  const handleCancelConfirm = async (reason) => {
    try {
      await cancelJob({ jobId: quoteId, reason }).unwrap();
      setCancelModalVisible(false);
      router.push("/provider/myJobs");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Cancellation Failed",
        text2: err?.message || "Please try again.",
      });
    }
  };

  return (
    <View className="flex-1  bg-[#f9f9f9]">
      <View className="px-[6%]">
        <CustomTitle
          title={
            capitalizeFirstLetter(pendingJobs?.job?.serviceCategory?.title) ||
            "Service Details"
          }
        />
      </View>
      <ScrollView className="px-[6%]">
        <JobSummary quoteInfo={pendingJobs} />
      </ScrollView>

      <View
        className="flex-col gap-[1%]   border border-[#D8DCE0]  "
        style={[
          XStyle.shadowBox,
          {
            borderTopRightRadius: scale(20),
            borderTopLeftRadius: scale(20),
            // height: verticalScale(140),
          },
        ]}
      >
        <View className="flex-row gap-[6%]  justify-center overflow-hidden items-center ">
          <BotttomButtons
            onPress={() => setCancelModalVisible(true)}
            width={145}
            backgroundColor="#fff"
            color="#EF4444"
            borderColor="#EF4444"
            title="Cancel"
            loading={cancelLoading}
          />

          <BotttomButtons
            onPress={() =>
              router.push({
                pathname: "/provider/quote/provideUpdatedOffer",
                params: { jobId: jobId },
              })
            }
            width={145}
            backgroundColor="#fff"
            color="#175994"
            borderColor="#175994"
            title="Send Offer"
            // loading={isAccepting}
          />
        </View>
      </View>
      <CancelModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
      />
    </View>
  );
}
