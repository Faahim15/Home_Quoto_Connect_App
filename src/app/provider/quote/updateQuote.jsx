import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CustomTitle from "../../components/shared/CustomTitle";
import QuoteForm from "../../components/provider/map/QuoteForm";
import { Ionicons } from "@expo/vector-icons";
import BotttomButtons from "../../components/shared/services/buttons/BottomButtons";
import XStyle from "../../util/styles";
import { scale } from "../../components/adaptive/Adaptiveness";
import { toast } from "sonner-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import * as Yup from "yup";
import { useSubmitQuoteMutation } from "../../../redux/features/apiSlices/quote/quoteApiSlice";
import { useGetSingleJobQuery } from "../../../redux/features/apiSlices/user/createJobSlices";
import { convertToThirdDay } from "../../util/helper-function";
import { useUserProfileQuery } from "../../../redux/features/apiSlices/user/userApiSlices";

export default function UpdateQuoteScreen() {
  const { jobId } = useLocalSearchParams();

  const {
    data,
    isLoading: singleJobLoader,
    error,
  } = useGetSingleJobQuery(jobId);

  const [submitQuote, { isLoading }] = useSubmitQuoteMutation();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfileQuery();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    appointment: null,
    quoteDetails: "",
    warrantyDetails: "",
    price: 0,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // ✅ Clear error for that field immediately on change
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (isLoading || singleJobLoader || profileLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9]">
        <ActivityIndicator size="large" color="#175994" />
        <Text className="text-gray-500 text-base">
          Loading service details...
        </Text>
      </View>
    );
  }

  const service = data?.data?.job;
  const preferredDate = convertToThirdDay(service?.preferredDate);
  const credits = profile?.data?.user?.credits;

  const validationSchema = Yup.object({
    // ✅ Use Yup.mixed with explicit boolean check instead of Yup.boolean()
    appointment: Yup.mixed()
      .nullable()
      .test(
        "is-selected",
        "Please select whether an appointment is needed",
        (value) => value === true || value === false,
      ),

    quoteDetails: Yup.string()
      .required("Quote details are required")
      .min(20, "Quote details must be at least 20 characters")
      .max(1000, "Quote details must not exceed 1000 characters")
      .trim(),

    warrantyDetails: Yup.string()
      .required("Warranty details are required")
      .min(10, "Warranty details must be at least 10 characters")
      .max(500, "Warranty details must not exceed 500 characters")
      .trim(),

    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number")
      .min(5, "Price must be at least $5")
      .max(999999, "Price seems unreasonably high")
      .test(
        "is-decimal",
        "Price can have at most 2 decimal places",
        (value) => {
          if (value === undefined) return true;
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        },
      ),
  });

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const payload = {
        jobId,
        price: formData.price,
        description: formData.quoteDetails,
        isAvailable: formData.appointment,
        proposedDate: preferredDate,
        proposedTime: service?.preferredTime,
        warranty: { details: formData.warrantyDetails },
      };

      const res = await submitQuote(payload).unwrap();
      if (res?.success) {
        toast.success("Your submitted quote has been sent to the customer.");
        router.push("/provider/home");
      } else {
        toast.error(res?.message || "Quote submission failed");
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        const errorMessage =
          err?.data?.message || "Network or server error. Please try again.";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View className="flex-1 bg-[#F9F9F9]">
        <CustomTitle title="Update Quote" withSafeTop={true} />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-[3%]">
            <QuoteForm
              job={service}
              radioButtonChange={(value) =>
                handleInputChange("appointment", value)
              }
              quoteDetailsChange={(text) =>
                handleInputChange("quoteDetails", text)
              }
              onWarrantyChange={(text) =>
                handleInputChange("warrantyDetails", text)
              }
              errors={errors}
              onPriceChange={(value) => handleInputChange("price", value)}
              price={formData.price}
              formData={formData}
            />
          </View>

          <View className="flex-row px-[4%] items-center mb-[2%]">
            <Ionicons name="bulb-outline" size={18} color="#f59e0b" />
            <Text className="font-poppins-400regular text-justify w-[90%] text-xs text-[#1F2937] ml-[2%]">
              Submitting this quote will cost 5 credits. Your current balance is{" "}
              {credits || "N/A"} credits.
            </Text>
          </View>
        </ScrollView>

        <View
          className="flex-row gap-[6%] h-[18%] border border-[#D8DCE0] justify-center items-center"
          style={[
            XStyle.shadowBox,
            { borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20) },
          ]}
        >
          <BotttomButtons
            onPress={() => router.back()}
            backgroundColor="#fff"
            color="#EF4444"
            borderColor="#EF4444"
            title="Cancel"
          />
          <BotttomButtons
            onPress={handleSubmit}
            backgroundColor="#2583B6"
            color="#fff"
            borderColor="#2583B6"
            title="Send Quote"
            disabled={isLoading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
