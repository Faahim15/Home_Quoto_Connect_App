import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import CustomTitle from "../../components/shared/services/CustomTitle";
import QuoteForm from "../../components/provider/map/QuoteForm";
import { Ionicons } from "@expo/vector-icons";
import BotttomButtons from "../../components/shared/services/buttons/BottomButtons";
import XStyle from "../../util/styles";
import { scale } from "../../components/adaptive/Adaptiveness";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import * as Yup from "yup";
import { useSubmitQuoteMutation } from "../../../redux/features/apiSlices/quote/quoteApiSlice";
import { useGetSingleJobQuery } from "../../../redux/features/apiSlices/user/createJobSlices";
import { convertToThirdDay } from "../../util/helper-function";

export default function UpdateQuoteScreen() {
  const { jobId } = useLocalSearchParams();

  const {
    data,
    isLoading: singleJobLoader,
    error,
  } = useGetSingleJobQuery(jobId);
  const [submitQuote, { isLoading }] = useSubmitQuoteMutation();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    appointment: null,
    quoteDetails: "",
    warrantyDetails: "",
    price: 0,
  });
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  if (isLoading || singleJobLoader) {
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

  // console.log("indivaiudal job", convertToThirdDay(service?.preferredDate));

  const validationSchema = Yup.object({
    appointment: Yup.boolean()
      .nullable()
      .required("Please select whether an appointment is needed")
      .test(
        "is-selected",
        "Please select whether an appointment is needed",
        (value) => value !== null
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
        }
      ),
  });

  const handleSubmit = async () => {
    try {
      // Step 1: Validate user input
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      // Step 2: Prepare JSON payload
      const payload = {
        jobId,
        price: formData.price,
        description: formData.quoteDetails,
        isAvailable: formData.appointment,
        proposedDate: preferredDate,
        proposedTime: service?.preferredTime,
        warranty: {
          details: formData.warrantyDetails,
        },
      };

      // Step 3: Call API
      const res = await submitQuote(payload).unwrap();

      // Step 4: Handle success
      if (res?.success) {
        Toast.show({
          type: "success",
          text1: "Quote Submitted Successfully ✅",
          text2: "Your submitted quote has been sent to the customer.",
          position: "top",
          visibilityTime: 2500,
        });
        router.push("/provider/home");
      } else {
        // Step 5: Handle logical failure
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res?.message || "Quote submission failed",
          visibilityTime: 2000,
        });
      }
    } catch (err) {
      // Step 6: Handle validation or network errors
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
        console.log("validation error", validationErrors);
      } else {
        console.log("API Error:", err);
        const errorMessage =
          err?.message || "Network or server error. Please try again.";

        Toast.show({
          type: "error",
          text1: "Error",
          text2: errorMessage,
          visibilityTime: 2000,
        });
      }
    }
  };

  return (
    <View className="flex-1  bg-[#F9F9F9]">
      <View className="px-[4%]">
        <CustomTitle title="Update Quote" />
      </View>

      <ScrollView>
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
          <Text className="font-poppins-400regular  text-justify w-[90%] text-xs text-[#1F2937] ml-[2%]">
            Submitting this quote will cost 5 credits. Your current balance is
            25 credits.
          </Text>
        </View>
      </ScrollView>

      <View
        className="flex-row gap-[6%] h-[14%]   border border-[#D8DCE0] justify-center items-center "
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
  );
}
