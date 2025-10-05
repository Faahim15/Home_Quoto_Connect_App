import { View, Text, Pressable } from "react-native";
import { useState } from "react";

export default function UpdatedOffer() {
  const [offerStatus, setOfferStatus] = useState(null); // null, 'approved', 'declined'
  const [isLoading, setIsLoading] = useState(false);

  const handleApproval = async () => {
    if (isLoading || offerStatus) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOfferStatus("approved");
    } catch (error) {
      console.error("Failed to approve offer:", error);
      // Handle error state here
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    if (isLoading || offerStatus) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOfferStatus("declined");
    } catch (error) {
      console.error("Failed to decline offer:", error);
      // Handle error state here
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = (type) => {
    if (isLoading) return "Processing...";
    if (type === "approve") {
      return offerStatus === "approved" ? "Approved" : "Approve offer";
    }
    return offerStatus === "declined" ? "Declined" : "Decline";
  };

  const isButtonDisabled = (type) => {
    if (isLoading) return true;
    if (offerStatus && offerStatus !== type + "d") return true;
    return false;
  };

  return (
    <View className=" justify-center items-center">
      <View className=" flex-row gap-[4%]">
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
