import { View, KeyboardAvoidingView, Platform } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import LocationDetails from "../components/tabs/jobs/LocationDetails";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import { useState, useEffect } from "react";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import { setJobData } from "../../redux/features/jobPost/jobPostSlice"; // Import the action

export default function LocationDetailsScreen() {
  const jobData = useSelector((state) => state.jobPost);
  const { jobId } = useLocalSearchParams();
  const dispatch = useDispatch();
  console.log("address from jobLocation", jobData.location);
  const { data, isLoading, error, refetch } = useGetSingleJobQuery(jobId, {
    skip: !jobId, // Skip query if no jobId
  });

  const [validationErrors, setValidationErrors] = useState({});

  // 🔄 Populate form with existing job data when available
  useEffect(() => {
    if (data?.success && data?.data?.job) {
      const job = data.data.job;

      // Extract location details from the API response
      const locationDetails = job.location?.details || {};

      // Prepare the job data for Redux store
      const jobFormData = {
        houseNumber: locationDetails.houseNumber || "",
        streetNumber: locationDetails.streetNumber || "",
        completeAddress: locationDetails.completeAddress || "",
        location: {
          type: job.location?.type || "Point",
          coordinates: job.location?.coordinates || [],
          address: job.location?.address || "",
          city: job.location?.details?.city || "",
          state: job.location?.details?.state || "",
          country: job.location?.details?.country || "",
          zipCode: job.location?.details?.zipCode || "",
        },
      };

      // Dispatch to update Redux store with existing job data
      dispatch(setJobData(jobFormData));
    }
  }, [data, dispatch]);

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

      // ✅ If validation passes, go to job summary page
      // Pass jobId if editing existing job
      if (jobId) {
        router.push({
          pathname: "/jobs/jobSummary",
          params: { jobId },
        });
      } else {
        router.push("/jobs/jobSummary");
      }
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
      }
    }
  };

  // Show loading state while fetching data
  if (isLoading && jobId) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading job details...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 50}
      >
        <View className="flex-1  px-[6%] bg-[#F9F9F9]">
          <View className="">
            <CustomTitle title={jobId ? "Edit Job Location" : "Post a Job"} />
          </View>
          <View className="">
            <LocationDetails
              validationErrors={validationErrors}
              jobId={jobId}
            />
          </View>
          <View className="flex-1 mt-[90%] ">
            <CustomButton
              title={jobId ? "Update Location" : "Continue"}
              onPress={handleContinue}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
