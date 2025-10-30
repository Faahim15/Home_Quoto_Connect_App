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

  console.log("Data:", jobData);

  const jobValidationSchema = Yup.object({
    title: Yup.string()
      .required("Job title is required")
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be less than 100 characters"),

    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must be less than 1000 characters"),

    serviceCategory: Yup.string()
      .required("Service category is required")
      .matches(/^[0-9a-fA-F]{24}$/, "Invalid service category ID"),

    specializations: Yup.array()
      .of(
        Yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid specialization ID")
      )
      .min(1, "At least one specialization is required")
      .required("Specializations are required"),

    location: Yup.object({
      type: Yup.string().oneOf(["Point"], "Location type must be Point"),
      coordinates: Yup.array()
        .of(Yup.number().required())
        .length(2, "Coordinates must have exactly 2 values")
        .test("valid-coordinates", "Invalid coordinates", (value) => {
          if (!value) return false;
          const [lng, lat] = value;
          return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
        }),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
      zipCode: Yup.string().required("Zip code is required"),
    }).required("Location is required"),

    houseNumber: Yup.string().required("House number is required"),
    streetNumber: Yup.string().required("Street number is required"),
    completeAddress: Yup.string().required("Complete address is required"),

    urgency: Yup.string()
      .oneOf(["urgent", "asap", "next_week"], "Invalid urgency value")
      .required("Urgency is required"),

    preferredDate: Yup.string()
      .required("Preferred date is required")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .test("future-date", "Date must be in the future", (value) => {
        return new Date(value) > new Date();
      }),

    preferredTime: Yup.string()
      .required("Preferred time is required")
      .matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Time must be in HH:MM format"
      ),

    specificInstructions: Yup.string().max(
      500,
      "Instructions must be less than 500 characters"
    ),

    photos: Yup.array()
      .of(
        Yup.object({
          uri: Yup.string().required(),
          type: Yup.string(),
          name: Yup.string(),
        })
      )
      .min(1, "At least one photo is required")
      .max(10, "Maximum 10 photos allowed"),

    priceRange: Yup.object({
      from: Yup.number()
        .required("Price from is required")
        .min(0, "Price cannot be negative")
        .max(1000000, "Price is too high"),
      to: Yup.number()
        .required("Price to is required")
        .min(Yup.ref("from"), "To price must be greater than from price")
        .max(1000000, "Price is too high"),
      isPersonalized: Yup.boolean().required(),
    }).required("Price range is required"),
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
      // ✅ FIXED: Specializations as JSON string array (like Postman)
      // formData.append("specializations", JSON.stringify(jobData.specializations));
      // formData.append("specializations", jobData.specializations);
      // jobData.specializations.forEach((id, index) => {
      //   formData.append(`specializations[${index}]`, id);
      // });
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
        position: "bottom",
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
            <CustomButton title="Continue" onPress={handleContinue} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
