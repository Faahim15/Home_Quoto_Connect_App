import { View } from "react-native";
import { router } from "expo-router";
import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import Stripe from "../../components/tabs/myJobs/Stripe";
import CustomButton from "../../components/tabs/home/services/provider/details/CustomButton";
import { useCreatePaymentsIntentsMutation } from "../../../redux/features/apiSlices/auth/authApiSlices";
import { toast } from "sonner-native";

export default function BackgroundCheckPayment() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [createPaymentIntent, { isLoading }] =
    useCreatePaymentsIntentsMutation();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // Create payment intent - no parameters needed
      const res = await createPaymentIntent({}).unwrap();

      const { clientSecret, paymentIntentId, amount, currency } = res?.data;

      if (!clientSecret) {
        toast.error("Client secret not found!");
        return;
      }

      // Store payment details for reference
      setPaymentDetails({
        paymentIntentId,
        amount,
        currency,
      });

      // Initialize payment sheet
      const initSheet = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "HomeQuote Connect",
        appearance: {
          colors: {
            primary: "#635BFF",
          },
        },
        paymentSheetParameters: {
          allowedPaymentMethods: ["Card"],
          style: "Alwayslight",
        },
      });

      if (initSheet.error) {
        toast.error(initSheet.error.message);
        setIsProcessing(false);
        return;
      }

      // Present payment sheet
      const paymentResult = await presentPaymentSheet();

      if (paymentResult.error) {
        toast.error(paymentResult.message);
        setIsProcessing(false);
        return;
      }

      // Payment successful
      toast.success(
        `Payment of $${(amount / 100).toFixed(2)} ${currency.toUpperCase()} completed successfully!`,
      );

      // Navigate to finalize screen with paymentIntentId as params
      router.replace({
        pathname: "/provider/auth/backgroundCheck-finalize",
        params: {
          paymentIntentId: paymentIntentId,
          amount: amount,
          currency: currency,
        },
      });
    } catch (err) {
      console.log("show", err);
      toast.error(err?.data?.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <Stripe />

      <View className="flex-1 mb-[20%] px-[6%] justify-end gap-3">
        <CustomButton
          title="Proceed to Payment"
          onPress={handlePayment}
          isLoading={isLoading || isProcessing}
          disabled={isLoading || isProcessing}
          bg="#635BFF"
          text="#fff"
          borderColor="#635BFF"
        />
      </View>
    </View>
  );
}
