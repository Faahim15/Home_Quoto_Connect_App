import { View, KeyboardAvoidingView, Platform } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import LocationDetails from "../components/tabs/jobs/LocationDetails";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import { useState } from "react";

export default function DirectJobLocation() {
  const jobData = useSelector((state) => state.jobPost);
  const [validationErrors, setValidationErrors] = useState({});

  console.log("📍 Current location data:", jobData.location);

  const locationValidationSchema = Yup.object({
    houseNumber: Yup.string()
      .required("House number is required")
      .min(1, "House number must be at least 1 character")
      .max(20, "House number must be less than 20 characters"),

    streetNumber: Yup.string()
      .required("Street number is required")
      .min(1, "Street number must be at least 1 character")
      .max(20, "Street number must be less than 20 characters"),

    completeAddress: Yup.string()
      .required("Complete address is required")
      .min(10, "Please provide a more detailed address")
      .max(200, "Address is too long"),
  });

  const handleContinue = async () => {
    try {
      // Clear previous errors
      setValidationErrors({});

      // Validate only location details
      await locationValidationSchema.validate(jobData, { abortEarly: false });

      console.log("✅ Location validation passed");
      console.log("📊 Location data:", {
        houseNumber: jobData.houseNumber,
        streetNumber: jobData.streetNumber,
        completeAddress: jobData.completeAddress,
        location: jobData.location,
      });

      // Navigate to job summary page
      router.push("/shared/directJobSummary");
    } catch (validationError) {
      if (validationError.name === "ValidationError") {
        // Convert Yup errors to a structured object
        const errors = {};
        validationError.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setValidationErrors(errors);

        // Show first error in toast
        const firstError = validationError.inner[0].message;
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: firstError,
          position: "bottom",
        });

        console.log("❌ Validation errors:", errors);
      }
    }
  };

  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 50}
      >
        <View className="flex-1 px-[6%] bg-[#F9F9F9]">
          <View>
            <CustomTitle title="Post a Job" />
          </View>
          <View>
            <LocationDetails validationErrors={validationErrors} />
          </View>
          <View className="flex-1 mt-[90%]">
            <CustomButton title="Continue" onPress={handleContinue} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
