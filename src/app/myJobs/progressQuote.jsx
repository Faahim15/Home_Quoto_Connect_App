import { Text, View, ScrollView } from "react-native";
import { scale } from "../components/adaptive/Adaptiveness";
import QuoteReqData from "../components/data/jobs/QuotesData";
import XStyle from "../util/styles";
import { router, useLocalSearchParams } from "expo-router";
import CustomTitle from "../components/shared/services/CustomTitle";
import QuoteProgressDetails from "../components/tabs/myJobs/QuoteProgressDetails";
import PaymentMethodModal from "../components/shared/modal/PaymentMethodModal";
import { useState } from "react";
import Feedback from "../components/tabs/myJobs/Feedback";
import BotttomButtons from "../components/shared/services/buttons/BottomButtons";
import CancelModal from "../components/shared/modal/CancelModal";
export default function ProgressQuote() {
  const { serviceId } = useLocalSearchParams();
  const [showPayment, setShowPayment] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const appointmentData = {
    service: "TV repair",
    provider: "Jackson",
    price: "320",
  };
  const handleCancelConfirm = (reason) => {
    console.log("Cancellation reason:", reason);
  };
  const item = QuoteReqData.find((s) => s.id.toString() === serviceId);

  const renderButton =
    item.status === "Completed" ? (
      <Feedback onPress={() => router.push("/shared/reviewForm")} item={item} />
    ) : (
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
      <View className="px-[4%]">
        <CustomTitle title="Quote Details" />
      </View>
      <ScrollView>
        <QuoteProgressDetails showStatus={true} item={item} />
      </ScrollView>
      <View
        className="flex-row w-full gap-[6%] h-[10%]  border border-[#D8DCE0] justify-center items-center "
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
      <CancelModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
        appointmentDetails={appointmentData}
      />
      <PaymentMethodModal
        visible={showPayment}
        onClose={() => setShowPayment(false)}
      />
    </View>
  );
}
