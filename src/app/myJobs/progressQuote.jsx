import { View, ScrollView, Text } from "react-native";
import { scale } from "../components/adaptive/Adaptiveness";
import XStyle from "../util/styles";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import CustomTitle from "../components/shared/services/CustomTitle";
import QuoteProgressDetails from "../components/tabs/myJobs/QuoteProgressDetails";
import PaymentMethodModal from "../components/shared/modal/PaymentMethodModal";
import { useState, useCallback } from "react";
import Feedback from "../components/tabs/myJobs/Feedback";
import BotttomButtons from "../components/shared/services/buttons/BottomButtons";
import CancelModal from "../components/shared/modal/CancelModal";
import OfferDetailsModal from "../components/shared/modal/OfferDetailsModal";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import { useQuoteById } from "../../hooks/useQuoteById";

export default function ProgressQuote() {
  const { jobId, quoteId } = useLocalSearchParams();
  const [showPayment, setShowPayment] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const { data, isLoading, error, refetch } = useGetSingleJobQuery(jobId);
  const item = data?.data?.job;
  const quote = useQuoteById(item?.quotes, quoteId);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9]">
        <Text className="text-gray-500 text-base">Loading job details...</Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9] px-[6%]">
        <CustomTitle title="Service not found" />
        <Text className="text-gray-500 text-base mt-[2%]">
          We couldn't locate the service details. Please check the link or try
          again later.
        </Text>
      </View>
    );
  }

  const appointmentData = {
    service: "TV repair",
    provider: "Jackson",
    price: "320",
  };

  const handleDecline = () => {
    setModalVisible(false);
  };
  const handleApprove = () => {
    setModalVisible(false);
  };
  const handleCancelConfirm = (reason) => {
    console.log("Cancellation reason:", reason);
  };

  // const renderButton =
  //   item?.status === "Completed" ? (
  //     <Feedback onPress={() => router.push("/shared/reviewForm")} item={item} />
  //   ) : (
  //     <>
  //       <BotttomButtons
  //         onPress={() => setCancelModalVisible(true)}
  //         backgroundColor="#fff"
  //         color="#EF4444"
  //         borderColor="#EF4444"
  //         title="Cancel"
  //       />
  //       <BotttomButtons
  //         onPress={() => setShowPayment(true)}
  //         backgroundColor="#18649F"
  //         color="#fff"
  //         borderColor="#18649F"
  //         title="Pay Now"
  //       />
  //     </>
  //   );
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
      <View className="px-[4%]">
        <CustomTitle title="Quote Details" />
      </View>
      <ScrollView>
        <QuoteProgressDetails showStatus={true} job={item} quote={quote} />
      </ScrollView>

      {quote?.status !== "updated" && (
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
      )}
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
      {/* {item?.sentQuote && (
        <OfferDetailsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          offerData={item}
          onDecline={handleDecline}
          onApprove={handleApprove}
        />
      )} */}
    </View>
  );
}
