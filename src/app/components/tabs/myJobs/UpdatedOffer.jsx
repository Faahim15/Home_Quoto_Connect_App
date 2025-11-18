import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import { useQuoteActions } from "../../../../hooks/useQuoteActions";
// Adjust path as needed

export default function UpdatedOffer({ quoteId, onSuccess }) {
  const [offerStatus, setOfferStatus] = useState(null); // null, 'approved', 'declined'

  const { acceptQuote, cancelQuote, isAccepting, isDeclining } =
    useQuoteActions();

  const handleApproval = async () => {
    if (isAccepting || offerStatus) return;

    try {
      await acceptQuote(quoteId, () => {
        setOfferStatus("approved");
        if (onSuccess) {
          onSuccess();
        }
      });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleDecline = async () => {
    if (isDeclining || offerStatus) return;

    try {
      await cancelQuote(quoteId, () => {
        setOfferStatus("declined");
        if (onSuccess) {
          onSuccess();
        }
      });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const getButtonText = (type) => {
    if (isAccepting || isDeclining) return "Processing...";
    if (type === "approve") {
      return offerStatus === "approved" ? "Approved" : "Approve offer";
    }
    return offerStatus === "declined" ? "Declined" : "Decline";
  };

  const isButtonDisabled = (type) => {
    if (isAccepting || isDeclining) return true;
    if (offerStatus && offerStatus !== type + "d") return true;
    return false;
  };

  return (
    <View className="mt-[4%] justify-center items-center">
      <View>
        <Text className="font-poppins-400regular text-xs text-[#F59E0B] ">
          Sent an updated quote!
        </Text>
      </View>

      <View className="mt-[4%] flex-row gap-[4%]">
        <Pressable
          onPress={handleDecline}
          disabled={isButtonDisabled("decline")}
          style={{
            width: "35%",
            opacity: isButtonDisabled("decline") ? 0.5 : 1,
          }}
          className="px-[3%] py-[3%] rounded-md border border-[#EF4444]"
          accessibilityRole="button"
          accessibilityLabel="Decline the updated offer"
          accessibilityState={{
            disabled: isButtonDisabled("decline"),
            selected: offerStatus === "declined",
          }}
        >
          <Text
            className="text-center font-poppins text-xs"
            style={{
              color: offerStatus === "declined" ? "#EF4444" : "#EF4444",
            }}
          >
            {getButtonText("decline")}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleApproval}
          disabled={isButtonDisabled("approve")}
          style={{
            width: "35%",
            opacity: isButtonDisabled("approve") ? 0.5 : 1,
            backgroundColor:
              offerStatus === "approved" ? "#F59E0B" : "transparent",
          }}
          className="px-[3%] py-[3%] rounded-md border border-[#F59E0B]"
          accessibilityRole="button"
          accessibilityLabel="Approve the updated offer"
          accessibilityState={{
            disabled: isButtonDisabled("approve"),
            selected: offerStatus === "approved",
          }}
        >
          <Text
            className="text-center font-poppins text-xs"
            style={{
              color: offerStatus === "approved" ? "#FFFFFF" : "#F59E0B",
            }}
          >
            {getButtonText("approve")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
