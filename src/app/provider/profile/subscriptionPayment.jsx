import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useStripe } from "@stripe/stripe-react-native";
import { usePurchaseSubscriptionMutation } from "../../../redux/features/apiSlices/payment/paymentApiSlice";
import CustomButton from "../../components/tabs/home/services/provider/details/CustomButton";
import Stripe from "../../components/tabs/myJobs/Stripe";

export default function StripePayment() {
  const { subscriptionId } = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // ⬇️ Now isLoading comes from RTK Query
  const [purchaseSubscription, { isLoading }] =
    usePurchaseSubscriptionMutation();

  const handlePayment = async () => {
    try {
      const res = await purchaseSubscription({
        subscriptionId,
        paymentMethod: "card",
      }).unwrap();

      const clientSecret = res?.data?.clientSecret;
      if (!clientSecret) {
        alert("Client secret not found!");
        return;
      }

      // Only allow card payments
      const initSheet = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "HomeQuote Connect",
        paymentSheetParameters: {
          allowedPaymentMethods: ["Card"],
        },
      });

      if (initSheet.error) {
        alert(initSheet.error.message);
        return;
      }

      const paymentResult = await presentPaymentSheet();

      console.log("payment Resut", paymentResult);

      if (paymentResult.error) {
        alert(paymentResult.error.message);
        return;
      }

      router.push("/provider/home");
    } catch (err) {
      alert(err?.message || "Payment Failed!");
    }
  };

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <Stripe />

      <View className="flex-1 mb-[20%] px-[6%] justify-end">
        <CustomButton
          title="Proceed to Payment"
          onPress={handlePayment}
          isLoading={isLoading}
          bg="#635BFF"
          text="#fff"
          borderColor="#635BFF"
        />
      </View>
    </View>
  );
}
