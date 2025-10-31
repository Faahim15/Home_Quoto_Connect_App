import { Text, View, KeyboardAvoidingView, Platform } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import LocationDetails from "../components/tabs/jobs/LocationDetails";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { useCreateJobMutation } from "../../redux/features/apiSlices/user/createJobSlices";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import { useState } from "react";
export default function LocationDetailsScreen() {
  const jobData = useSelector((state) => state.jobPost);
  const [validationErrors, setValidationErrors] = useState({});
  const [longitude, latitude] = jobData.location.coordinates;

  console.log("Job Data:", jobData);

  const jobValidationSchema = Yup.object({
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
  const [createJob, { isLoading }] = useCreateJobMutation();

  const handleContinue = async () => {
    try {
      // Clear previous errors
      setValidationErrors({});
      // Validate the data before sending
      await jobValidationSchema.validate(jobData, { abortEarly: false });
      const formData = new FormData();

      // 🧾 Append all simple fields
      formData.append("title", jobData.title);
      formData.append("description", jobData.specificInstructions);
      formData.append("serviceCategory", jobData.serviceCategory);

      // specializations
      formData.append(
        "specializations",
        `["${jobData.specializations.join('","')}"]`
      );
      //post location

      (formData.append("location[type]", "Point"),
        formData.append("location[coordinates][0]", longitude));
      formData.append("location[coordinates][1]", latitude);
      formData.append("location[details][houseNumber]", jobData.houseNumber);
      formData.append("location[details][streetNumber]", jobData.streetNumber);
      formData.append(
        "location[details][completeAddress]",
        jobData.completeAddress
      );
      formData.append("location[details][city]", jobData.location.city);
      formData.append("location[details][state]", jobData.location.state);
      formData.append("location[details][country]", jobData.location.country);
      formData.append(
        "location[details][zipCode]",
        jobData?.location?.zipCode || "N/A"
      );
      formData.append("location[address]", jobData.location.address);

      // posting date and time

      formData.append("urgency", jobData.urgency);
      formData.append("preferredDate", jobData.preferredDate);
      formData.append("preferredTime", jobData.preferredTime);
      formData.append("specificInstructions", jobData.specificInstructions);

      //posting photos

      if (jobData.photos && jobData.photos.length > 0) {
        jobData.photos.forEach((photo, index) => {
          formData.append("photos", {
            uri: photo.uri,
            type: photo.type || "image/jpeg",
            name: photo.name || `photo_${index}.jpg`,
          });
        });
      }

      //posting price Range

      formData.append("priceRange[from]", jobData.priceRange.from);
      formData.append("priceRange[to]", jobData.priceRange.to);
      formData.append(
        "priceRange[isPersonalized]",
        jobData.priceRange.isPersonalized
      );
      // 🚀 Send to backend
      const response = await createJob(formData).unwrap();

      console.log("✅ Job posted successfully:", response);
      // Show success toast
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Job created successfully!",
        position: "top",
      });

      router.push("/jobs/jobSummary");
    } catch (validationError) {
      if (validationError.name === "ValidationError") {
        // Convert Yup errors to a structured object
        const errors = {};
        validationError.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setValidationErrors(errors);
        console.log("Validation Errors:", errors);
        // Show first error in toast
        const firstError = validationError.inner[0].message;
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: firstError,
          position: "bottom",
        });
      } else {
        // Handle other errors
        console.error("❌ Job creation failed:", validationError);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong. Please try again.",
          position: "bottom",
        });
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
        <View className="flex-1  px-[6%] bg-[#F9F9F9]">
          <View className="">
            <CustomTitle title="Post a Job" />
          </View>
          <View className="">
            <LocationDetails validationErrors={validationErrors} />
          </View>
          <View className="flex-1 mt-[90%] ">
            <CustomButton
              isLoading={isLoading}
              title="Continue"
              onPress={handleContinue}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
