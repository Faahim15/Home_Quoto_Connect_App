import { View } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "./ServiceButton";
import { router } from "expo-router";
import XStyle from "../../../../util/styles";
import { scale } from "../../../adaptive/Adaptiveness";

export default function UpdateQuoteButton({ title, serviceId, quoteId }) {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const verifiedStatus = await AsyncStorage.getItem("isVerified");
        // Convert string "true" to boolean true, everything else to false
        setIsVerified(verifiedStatus === "true");
      } catch (error) {
        console.error("Error reading verification status:", error);
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkVerificationStatus();
  }, []);

  const handleUpdateOfferButton = () => {
    if (!isVerified) {
      console.log("Provider is not verified");
      return;
    }

    if (title === "Send an offer") {
      router.push({
        pathname: "/provider/quote/updateQuote",
        params: { jobId: serviceId },
      });
    } else {
      console.log("send an updated offer", quoteId);
      router.push({
        pathname: "/provider/quote/updatedOffer",
        params: { jobId: serviceId, quoteId: quoteId },
      });
    }
  };

  return (
    <View
      className="flex-col gap-[1%] border border-[#D8DCE0]"
      style={[
        XStyle.shadowBox,
        {
          borderTopRightRadius: scale(20),
          borderTopLeftRadius: scale(20),
        },
      ]}
    >
      <View className="px-[3%]">
        <CustomButton
          onPress={handleUpdateOfferButton}
          title={title}
          disabled={isLoading || !isVerified}
        />
      </View>
    </View>
  );
}
