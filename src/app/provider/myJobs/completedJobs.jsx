import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CustomTitle from "../../components/shared/CustomTitle";
import JobSummary from "../../components/tabs/jobs/JobSummary";
import { completedJobsData } from "../../components/data/provider/MyJobsData";
import { router, useLocalSearchParams } from "expo-router";
import { useGetAllQuotesQuery } from "../../../redux/features/apiSlices/quote/quoteApiSlice";
import { Ionicons } from "@expo/vector-icons";
import ProviderJobSummary from "../../components/tabs/jobs/ProviderJobSummary";
import XStyle from "../../util/styles";
import { scale } from "../../components/adaptive/Adaptiveness";
import BotttomButtons from "../../components/shared/services/buttons/BottomButtons";
import CustomButton from "../../components/tabs/home/services/provider/details/CustomButton";
export default function CompletedJobsDetailScreen() {
  const { quoteId, jobId } = useLocalSearchParams();

  // Fetch all quotes
  const { data, isLoading, error, refetch } = useGetAllQuotesQuery();

  // Loading UI
  if (isLoading) {
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
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9] px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="font-poppins-600semiBold text-lg text-gray-900 mt-4 text-center">
          Failed to Load Information
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

  const completedJobs =
    data?.data?.quotes?.find((q) => q._id === quoteId) || {};

  console.log("completed jobs", completedJobs?.price);

  return (
    <View className="flex-1  bg-[#f9f9f9]">
      <View className="px-[6%]">
        <CustomTitle
          title={
            completedJobs?.job?.serviceCategory?.title || "Service Details"
          }
        />
      </View>
      <ScrollView className="px-[6%]">
        <ProviderJobSummary
          quoteInfo={completedJobs}
          showPaymentCheckList={true}
        />
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
            onPress={() =>
              router.push({
                pathname: "provider/reviewForm",
                params: { jobId: jobId },
              })
            }
            width={320}
            backgroundColor="#175994"
            color="#fff"
            borderColor="#175994"
            title="Give Feedback"
            // loading={cancelLoading}
          />

          {/* <CustomButton
            onPress={() =>
              router.push({
                pathname: "provider/reviewForm",
                params: { jobId: jobId },
              })
            }
            title="Give Feedback"
          /> */}
        </View>
      </View>
    </View>
  );
}
