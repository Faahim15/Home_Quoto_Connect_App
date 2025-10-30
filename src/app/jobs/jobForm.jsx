import React from "react";
import { View, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";

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
import { setJobField } from "../../redux/features/jobPost/jobPostSlice";
import Error from "../components/shared/error/Error";

export default function JobFormScreen() {
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.jobPost);
  const [errors, setErrors] = React.useState({});
  const handleInputChange = (field, value) => {
    dispatch(setJobField({ field, value }));

    // ✅ Clear errors when user interacts
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // ✅ Special handling for urgent/price relationship
    if (field === "isUrgent" && value === true) {
      // If user selects urgent, clear price range
      dispatch(
        setJobField({
          field: "priceRange",
          value: { from: 0, to: 0, isPersonalized: true },
        })
      );
      setErrors((prev) => ({
        ...prev,
        "priceRange.from": undefined,
        "priceRange.to": undefined,
      }));
    }

    if (field === "priceRange" && value.from > 0) {
      // If user sets price, uncheck urgent
      dispatch(setJobField({ field: "isUrgent", value: false }));
      setErrors((prev) => ({ ...prev, isUrgent: undefined }));
    }
  };
  const validateCurrentPage = () => {
    const currentPageSchema = Yup.object({
      title: Yup.string().required("Job title is required"),
      serviceCategory: Yup.string().required("Service category is required"),
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
        .test("future-date", "Date must be in the future", (value) => {
          return new Date(value) > new Date();
        }),
      urgency: Yup.string().required("Please select urgency"),
      // ✅ VALIDATION: Either fixed price OR personalized (negotiable)
      priceRange: Yup.object().test(
        "valid-price-config",
        "Either set a fixed price range or mark as negotiable",
        function (value) {
          const { from, to, isPersonalized } = value || {};

          const hasFixedPrice = from > 0 && to > from;
          const isNegotiable = isPersonalized === true;

          // Must have either fixed price OR be negotiable
          return hasFixedPrice || isNegotiable;
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
      router.push("/jobs/jobLocation");
    } else
      console.log(
        "errors",
        errors["priceRange.from"] ?? errors["priceRange.to"]
      );
  };
  // Check conditions
  const hasFixedPrice =
    jobData.priceRange?.from > 0 &&
    jobData.priceRange?.to > jobData.priceRange?.from;
  const isNegotiable = jobData.priceRange?.isPersonalized === true;
  return (
    <View className="bg-[#f9f9f9] flex-1">
      {/* Header */}
      <View className="px-[6%]">
        <CustomTitle title="Post a Job" />
      </View>

      {/* Scrollable form */}
      <FlatList
        data={[]} // Dummy data to enable scroll
        keyExtractor={(_, index) => index.toString()}
        renderItem={null}
        contentContainerStyle={{ paddingBottom: verticalScale(70) }}
        ListHeaderComponent={
          <View className="pb-[10%]">
            {/* 🧾 Job Title */}
            <View className="px-[6%] mt-[3%]">
              <TextField
                label="Job Title"
                value={jobData.title}
                onChangeText={(value) => handleInputChange("title", value)}
              />
            </View>

            {/* 🧰 Service Search */}
            <ServiceSearch
              error={errors.serviceCategory}
              onSelectService={handleInputChange}
            />

            {/* 📍 Location */}
            <View className="px-[6%]">
              <LocationPicker
                onLocationSelect={(loc) => handleInputChange("location", loc)}
                error={errors.location}
              />
            </View>

            {/* 🕒 Time Picker */}
            <View className="px-[6%]">
              <TimePicker />
              <Error error={errors.preferredDate} />
            </View>

            {/* ⚙️ Job Type / Options */}
            <View className="px-[6%]">
              <ButtonGroup
                selectedOption={jobData.jobType}
                handleInputChange={handleInputChange}
              />
              <Error error={errors.urgency} />
            </View>

            {/* 💰 Price and Request */}
            <View className="px-[6%] mt-[3%]">
              <PriceSlider
                value={jobData.price}
                onChange={(value) => handleInputChange("price", value)}
                disabled={isNegotiable}
              />
              <Error
                error={errors['"priceRange.from"'] ?? errors["priceRange.to"]}
              />
              <RequestButton
                urgent={isNegotiable}
                onToggleUrgent={(value) => {
                  handleInputChange("priceRange", {
                    ...jobData.priceRange,
                    isPersonalized: value,
                  });
                }}
                disabled={hasFixedPrice} // Disable when fixed price set
              />
            </View>

            {/* 📝 Instructions */}
            <View className="mt-[3%] px-[6%]">
              <InstructionField
                // value={jobData.instructions}
                onChangeText={(value) =>
                  handleInputChange("specificInstructions", value)
                }
              />
            </View>

            {/* 🧠 Specializations */}
            <View className="px-[6%]">
              <Specializations
                // selected={jobData.specializations}
                onChange={handleInputChange}
              />
            </View>

            {/* 🚀 Continue Button */}
            <View className="px-[6%] mt-[5%]">
              <CustomButton title="Continue" onPress={handleContinue} />
            </View>
          </View>
        }
      />
    </View>
  );
}
