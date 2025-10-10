import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import CustomTitle from "../../components/shared/CustomTitle";
import JobSummary from "../../components/tabs/jobs/JobSummary";
import { acceptJobData } from "../../components/data/provider/MyJobsData";
import CustomButton from "../../components/shared/services/buttons/ServiceButton";
import CancelModal from "../../components/shared/modal/CancelModal";
import BotttomButtons from "../../components/shared/services/buttons/BottomButtons";
import { router, useLocalSearchParams } from "expo-router";
import XStyle from "../../util/styles";
import { scale, verticalScale } from "../../components/adaptive/Adaptiveness";
export default function AcceptJobDetailScreen() {
  const { serviceId } = useLocalSearchParams();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const handleCancelConfirm = (reason) => {
    console.log("Cancellation reason:", reason);
  };
  const appointmentData = {
    service: "TV repair",
    provider: "Jackson",
    price: "320",
  };

  const quoteInfo = acceptJobData.find((s) => s.id.toString() === serviceId);
  // console.log(quoteInfo, "hello");
  return (
    <View className="flex-1  bg-[#f9f9f9]">
      <View className="px-[6%]">
        <CustomTitle title={quoteInfo.service} />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: verticalScale(50) }}
        className="px-[6%]"
      >
        <JobSummary quoteInfo={quoteInfo} showPaymentCheckList={true} />
      </ScrollView>
      {quoteInfo.status === "In Progress" && (
        <View
          className=" gap-[1%]   border border-[#D8DCE0]  "
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
              onPress={() => {
                setCancelModalVisible(true);
                // router.replace("/provider/home");
              }}
              backgroundColor="#fff"
              color="#EF4444"
              borderColor="#EF4444"
              title="Cancel"
              width={148}
            />

            <BotttomButtons
              onPress={() => router.push("/provider/quote/updateQuote")}
              backgroundColor="#175994"
              color="#fff"
              borderColor="#0054A5"
              title="Update Quote"
              width={148}
            />
          </View>
        </View>
      )}
      <CancelModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
        appointmentDetails={appointmentData}
      />
    </View>
  );
}
