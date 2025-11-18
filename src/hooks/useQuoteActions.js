import { useCallback } from "react";

import Toast from "react-native-toast-message";
import {
  useAcceptQuoteMutation,
  useCancelQuoteMutation,
} from "../redux/features/apiSlices/quote/quoteApiSlice";

export const useQuoteActions = () => {
  const [acceptQuote, { isLoading: isAccepting }] = useAcceptQuoteMutation();
  const [cancelQuote, { isLoading: isDeclining }] = useCancelQuoteMutation();

  const handleAcceptQuote = useCallback(
    async (quoteId, onSuccess) => {
      try {
        await acceptQuote({ id: quoteId }).unwrap();
        Toast.show({
          type: "success",
          text1: "Offer Approved",
          text2: "You've successfully approved the updated offer.",
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Approval Failed",
          text2: "Something went wrong while approving the offer.",
        });
        console.error("Accept error:", error);
        throw error; // Re-throw error if needed for component-level handling
      }
    },
    [acceptQuote]
  );

  const handleDeclineQuote = useCallback(
    async (quoteId, onSuccess) => {
      try {
        await cancelQuote({ id: quoteId }).unwrap();

        Toast.show({
          type: "error",
          text1: "Request Declined",
          text2: "The provider has been notified of your decision",
          position: "top",
          visibilityTime: 3000,
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Failed to Decline",
          text2: "Something went wrong. Please try again.",
        });
        console.error("Decline error:", error);
        throw error; // Re-throw error if needed for component-level handling
      }
    },
    [cancelQuote]
  );

  return {
    acceptQuote: handleAcceptQuote,
    cancelQuote: handleDeclineQuote,
    isAccepting,
    isDeclining,
    // Also return the raw mutations if needed
    rawAcceptQuote: acceptQuote,
    rawCancelQuote: cancelQuote,
  };
};
