import { useCallback } from "react";
import { toast } from "sonner-native";
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
        toast.success("You've successfully approved the updated offer.");

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        toast.error("Something went wrong while approving the offer.");
        console.error("Accept error:", error);
        throw error;
      }
    },
    [acceptQuote],
  );

  const handleDeclineQuote = useCallback(
    async (quoteId, onSuccess) => {
      try {
        await cancelQuote({ id: quoteId }).unwrap();
        toast.success("The provider has been notified of your decision.");

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
        console.error("Decline error:", error);
        throw error;
      }
    },
    [cancelQuote],
  );

  return {
    acceptQuote: handleAcceptQuote,
    cancelQuote: handleDeclineQuote,
    isAccepting,
    isDeclining,
    rawAcceptQuote: acceptQuote,
    rawCancelQuote: cancelQuote,
  };
};
