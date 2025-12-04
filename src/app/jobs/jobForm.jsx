import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
// Components
import CustomTitle from "../components/shared/CustomTitle";
import TextField from "../components/tabs/jobs/TextField";
import ServiceSearch from "../components/tabs/jobs/ServiceSearch";
import TimePicker from "../components/tabs/home/services/provider/TimePicker";
import ButtonGroup from "../components/tabs/home/services/provider/ButtonGroup";
import PriceSlider from "../components/tabs/home/PriceInput";
import RequestButton from "../components/tabs/home/services/provider/RequestButton";
import InstructionField from "../components/tabs/home/services/provider/InstructionField";
import Specializations from "../components/tabs/home/Specializations";
import LocationPicker from "../components/auth/LocationPicker";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import { verticalScale } from "../components/adaptive/Adaptiveness";
import * as Yup from "yup";
// Redux
import {
  setJobField,
  setJobData,
} from "../../redux/features/jobPost/jobPostSlice";
import Error from "../components/shared/error/Error";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";

export default function JobFormScreen() {
  const { jobId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.jobPost);
  const [errors, setErrors] = useState({});
  const [hasInitializedFromAPI, setHasInitializedFromAPI] = useState(false);

  const { data, isLoading, error, refetch } = useGetSingleJobQuery(jobId, {
    skip: !jobId,
  });

  const job = data?.data?.job;

  // ✅ SMART INITIALIZATION: Only initialize OTHER fields if they are empty
  useEffect(() => {
    if (job && jobId && !hasInitializedFromAPI) {
      // Check if other fields are empty (not photos since they come from upload screen)
      const hasOtherDataInRedux =
        jobData.title ||
        jobData.serviceCategory?.id ||
        jobData.specializations?.length > 0;

      if (!hasOtherDataInRedux) {
        console.log(
          "🔄 Initializing other fields from API (photos already exist)..."
        );

        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };

        // Transform specializations to match Redux format
        const transformedSpecializations =
          job.specializations?.map((spec) => ({
            id: spec._id,
            title: spec.title,
            category: spec.category,
          })) || [];

        // Prepare form data EXCLUDING photos (since they already exist from upload screen)
        const formData = {
          title: job.title || "",
          serviceCategory: {
            id: job.serviceCategory?._id || "",
            title: job.serviceCategory?.title || "",
          },
          location: {
            type: job.location?.type || "Point",
            coordinates: job.location?.coordinates || [],
            address: job.location?.address || "",
            city: job.location?.details?.city || "",
            state: job.location?.details?.state || "",
            country: job.location?.details?.country || "",
            zipCode: job.location?.details?.zipCode || "",
          },
          urgency: job.urgency || "",
          specificInstructions: job.description || "",
          specializations: transformedSpecializations,
          preferredDate: formatDate(job.preferredDate),
          preferredTime: job.preferredTime || "",
          priceRange: {
            from: job.priceRange?.from || 0,
            to: job.priceRange?.to || 0,
            isPersonalized: job.priceRange?.isPersonalized || false,
          },
          houseNumber: job.location?.details?.houseNumber || "",
          streetNumber: job.location?.details?.streetNumber || "",
          completeAddress: job.location?.details?.completeAddress || "",
        };

        console.log("📝 Form Data to Initialize (excluding photos):", {
          title: formData.title,
          serviceCategory: formData.serviceCategory,
          specializations: formData.specializations?.length,
          photosInRedux: jobData.photos?.length, // Show existing photos count
          urgency: formData.urgency,
          location: formData.location,
        });

        dispatch(setJobData(formData));
        console.log("✅ Other fields initialized from API, photos preserved");
      } else {
        console.log("🚫 Skipping API initialization - Redux already has data");
        console.log("📸 Current photos in Redux:", jobData.photos?.length);
      }

      setHasInitializedFromAPI(true);
    }
  }, [job, jobId, hasInitializedFromAPI, dispatch, jobData]);

  const handleInputChange = (field, value) => {
    dispatch(setJobField({ field, value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateCurrentPage = () => {
    const currentPageSchema = Yup.object({
      title: Yup.string().required("Job title is required"),
      serviceCategory: Yup.object()
        .shape({
          id: Yup.string().required("Service category is required"),
          title: Yup.string(),
        })
        .required("Service category is required"),
      location: Yup.object()
        .nullable()
        .required("Location is required")
        .test(
          "has-coordinates",
          "Location coordinates are required",
          (value) => {
            return value?.coordinates && value.coordinates.length === 2;
          }
        ),
      preferredDate: Yup.string()
        .required("Preferred date is required")
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .test("future-date", "Date must be today or in the future", (value) => {
          const inputDate = new Date(value);
          const today = new Date();
          inputDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          return inputDate >= today;
        }),
      urgency: Yup.string().required("Please select urgency"),
      priceRange: Yup.object().test(
        "valid-price-config",
        "Either set a fixed price range or mark as negotiable",
        function (value) {
          const { from, to, isPersonalized } = value || {};
          const hasAnyPriceValue = from > 0 || to > 0;
          const isNegotiable = isPersonalized === true;
          if (!hasAnyPriceValue && !isNegotiable) {
            return this.createError({
              path: this.path,
              message: "Either set a fixed price range or mark as negotiable",
            });
          }
          if (from > 0 && to > 0) {
            if (from > to) {
              return this.createError({
                path: this.path,
                message: "Minimum price cannot be greater than maximum price",
              });
            }
            if (from === to) {
              return this.createError({
                path: this.path,
                message: "Minimum and maximum price cannot be the same",
              });
            }
          }
          return true;
        }
      ),
      specificInstructions: Yup.string()
        .required("Specific instructions are required")
        .min(10, "Instructions must be at least 10 characters")
        .max(500, "Instructions cannot exceed 500 characters")
        .test(
          "not-just-whitespace",
          "Instructions cannot be only whitespace",
          (value) => {
            return value && value.trim().length > 0;
          }
        ),
      specializations: Yup.array().min(1, "Select at least one specialization"),
    });

    try {
      currentPageSchema.validateSync(jobData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleContinue = () => {
    if (validateCurrentPage()) {
      // ✅ Log final state before continuing
      if (jobData.photos && jobData.photos.length > 0) {
        const existingPhotos = jobData.photos.filter((p) => p.isExisting);
        const newPhotos = jobData.photos.filter((p) => !p.isExisting);

        console.log("✅ Final state before continuing:", {
          totalPhotos: jobData.photos.length,
          existingPhotos: existingPhotos.length,
          newPhotos: newPhotos.length,
          title: jobData.title,
          serviceCategory: jobData.serviceCategory,
          specializations: jobData.specializations?.length,
        });
      }

      if (jobId) {
        router.push({
          pathname: "/jobs/jobLocation",
          params: { jobId },
        });
      } else {
        router.push("/jobs/jobLocation");
      }
    } else {
      console.log("errors", errors);
    }
  };

  // ✅ Price conditions
  const hasAnyPriceValue =
    jobData.priceRange?.from > 0 || jobData.priceRange?.to > 0;

  const isNegotiable = jobData.priceRange?.isPersonalized === true;

  // Loading state
  if (isLoading && jobId) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9]">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-gray-600 text-base mt-4 font-medium">
          Loading job details...
        </Text>
      </View>
    );
  }

  // Error state
  if (error && jobId) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9] px-[6%]">
        <Text className="text-gray-800 text-xl font-bold mb-2">
          Unable to Load Job
        </Text>
        <Text className="text-gray-500 text-base text-center mb-6">
          We couldn't fetch the job details. Please check your connection and
          try again.
        </Text>
        <CustomButton title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View className="bg-[#f9f9f9] flex-1">
      {/* Header */}
      <View className="px-[6%]">
        <CustomTitle title={jobId ? "Edit Job" : "Post a Job"} />
      </View>

      {/* Scrollable form */}
      <FlatList
        data={[]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={null}
        contentContainerStyle={{ paddingBottom: verticalScale(70) }}
        ListHeaderComponent={
          <View className="pb-[10%]">
            {/* 🧾 Job Title */}
            <View className="px-[6%] mt-[3%]">
              <TextField
                error={errors.title}
                label="Job Title"
                value={jobData.title}
                onChangeText={(value) => handleInputChange("title", value)}
                placeholder="Enter job title"
              />
            </View>

            {/* 🧰 Service Search */}
            <ServiceSearch
              error={errors["serviceCategory.id"]}
              onSelectService={handleInputChange}
              initialService={jobData.serviceCategory}
            />

            {/* 📍 Location */}
            <View className="px-[6%]">
              <LocationPicker
                onLocationSelect={(loc) => handleInputChange("location", loc)}
                error={errors.location}
                value={jobData.location?.address}
              />
            </View>

            {/* 🕒 Time Picker */}
            <View className="px-[6%]">
              <TimePicker
                initialDate={jobData.preferredDate}
                initialTime={jobData.preferredTime}
              />
              <Error error={errors.preferredDate} />
            </View>

            {/* ⚙️ Job Type / Options */}
            <View className="px-[6%]">
              <ButtonGroup
                selectedOption={jobData.urgency}
                handleInputChange={handleInputChange}
              />
              <Error error={errors.urgency} />
            </View>

            {/* 💰 Price and Request */}
            <View className="px-[6%] mt-[3%]">
              <PriceSlider
                initialFrom={jobData.priceRange?.from}
                initialTo={jobData.priceRange?.to}
              />
              <Error error={errors.priceRange} />
              <RequestButton
                urgent={isNegotiable}
                onToggleUrgent={(value) => {
                  handleInputChange("priceRange", {
                    ...jobData.priceRange,
                    isPersonalized: value,
                  });
                }}
                disabled={hasAnyPriceValue}
              />
            </View>

            {/* 📝 Instructions */}
            <View className="mt-[3%] px-[6%]">
              <InstructionField
                value={jobData.specificInstructions}
                onChangeText={(value) =>
                  handleInputChange("specificInstructions", value)
                }
                placeholder="Describe the job in detail..."
              />
              <Error error={errors.specificInstructions} />
            </View>

            {/* 🧠 Specializations */}
            <View className="px-[6%]">
              <Specializations
                selected={jobData.specializations}
                onChange={handleInputChange}
              />
              <Error error={errors.specializations} />
            </View>

            {/* 🚀 Continue Button */}
            <View className="px-[6%] mt-[5%]">
              <CustomButton
                title={jobId ? "Update Job" : "Continue"}
                onPress={handleContinue}
              />
            </View>
          </View>
        }
      />
    </View>
  );
}
