import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useStripe } from "@stripe/stripe-react-native";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import StripeBox from "../components/tabs/myJobs/Stripe";
import { useCreatePaymentIntentMutation } from "../../redux/features/apiSlices/payment/paymentApiSlice";

export default function StripePayment() {
  const { jobId } = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // ⬇️ Now isLoading comes from RTK Query
  const [createPaymentIntent, { isLoading }] = useCreatePaymentIntentMutation();

  const handlePayment = async () => {
    try {
      // 1️⃣ Create payment intent
      const res = await createPaymentIntent({ jobId }).unwrap();

      const clientSecret = res?.data?.clientSecret;
      if (!clientSecret) {
        alert("Client secret not found!");
        return;
      }

      // 2️⃣ Init Stripe Payment Sheet
      const initSheet = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "HomeQuote Connect",
      });

      if (initSheet.error) {
        alert(initSheet.error.message);
        return;
      }

      // 3️⃣ Open the Stripe Payment UI
      const paymentResult = await presentPaymentSheet();

      if (paymentResult.error) {
        alert(paymentResult.error.message);
        return;
      }

      // 4️⃣ Payment success → Redirect
      router.push({
        pathname: "/Toaster",
        params: { res: "Payment Successful!" },
      });
    } catch (err) {
      alert(err?.message || "Payment Failed!");
    }
  };

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <StripeBox />

      <View className="flex-1 mb-[20%] px-[6%] justify-end">
        <CustomButton
          title="Proceed to Payment"
          onPress={handlePayment}
          isLoading={isLoading} // ⬅️ using Redux loading
          bg="#635BFF"
          text="#fff"
          borderColor="#635BFF"
        />
      </View>
    </View>
  );
}
