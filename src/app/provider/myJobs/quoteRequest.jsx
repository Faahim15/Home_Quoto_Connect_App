import { View, ScrollView } from "react-native";
import CustomTitle from "../../components/shared/CustomTitle";
import JobSummary from "../../components/tabs/jobs/JobSummary";
import XStyle from "../../util/styles";
import BotttomButtons from "../../components/shared/services/buttons/BottomButtons";
import { scale } from "../../components/adaptive/Adaptiveness";
import { useLocalSearchParams } from "expo-router";
import serviceData from "../../components/data/provider/MyJobsData";
import { router } from "expo-router";
import CustomButton from "../../components/shared/services/buttons/ServiceButton";
import CancelModal from "../../components/shared/modal/CancelModal";
import { useState } from "react";
import Toast from "react-native-toast-message";
export default function QuotesRequestDetailScreen() {
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
  const item = serviceData.find((s) => s.id.toString() === serviceId);

  const renderButton = item.requiresPersonalizedQuote ? (
    <BotttomButtons
      onPress={() => router.push("/provider/quote/updateQuote")}
      backgroundColor="#fff"
      color="#175994"
      borderColor="#175994"
      title="  Send an updated offer"
      width="full"
    />
  ) : (
    <BotttomButtons
      onPress={() => {
        Toast.show({
          type: "success",
          text1: "Offer Accepted",
          text2: "You've successfully accepted the offer.",
          position: "top",
          topOffset: 60,
          visibilityTime: 3000,
        });
        router.push("/provider/myJobs");
      }}
      backgroundColor="#fff"
      color="#175994"
      borderColor="#175994"
      title="Accept offer "
      width={148}
    />
  );
  return (
    <View className="flex-1  bg-[#f9f9f9]">
      <View className="px-[6%]">
        <CustomTitle title={item.service} />
      </View>
      <ScrollView className="px-[6%]">
        <JobSummary quoteInfo={item} />
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
            onPress={() => {
              setCancelModalVisible(true);
              // router.replace("/provider/home");
            }}
            backgroundColor="#fff"
            color="#EF4444"
            borderColor="#EF4444"
            title="Cancel"
            width={item.requiresPersonalizedQuote ? "full" : 148}
          />

          {renderButton}
        </View>
        {!item.requiresPersonalizedQuote && (
          <View className="px-[3%]">
            <CustomButton
              onPress={() => router.push("/provider/quote/updateQuote")}
              title="Update Quote"
            />
          </View>
        )}
      </View>
      <CancelModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
        appointmentDetails={appointmentData}
      />
    </View>
  );
}
