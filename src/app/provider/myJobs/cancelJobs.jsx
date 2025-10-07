import { View, Text, ScrollView } from "react-native";
import React from "react";
import CustomTitle from "../../components/shared/CustomTitle";
import JobSummary from "../../components/tabs/jobs/JobSummary";
import { cancelledJobData } from "../../components/data/provider/MyJobsData";
import { useLocalSearchParams } from "expo-router";
export default function AcceptJobDetailScreen() {
  const { serviceId } = useLocalSearchParams();
  const quoteInfo = cancelledJobData.find((s) => s.id.toString() === serviceId);
  return (
    <View className="flex-1  bg-[#f9f9f9]">
      <View className="px-[6%]">
        <CustomTitle title={quoteInfo.service} />
      </View>
      <ScrollView className="px-[6%]">
        <JobSummary quoteInfo={quoteInfo} showPaymentCheckList={true} />
      </ScrollView>
    </View>
  );
}
