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

    // ✅ Special handling for priceRange changes
    // if (field === "priceRange") {
    //   if (value.from > 0 || value.to > 0 || value.isPersonalized) {
    //     setErrors((prev) => ({
    //       ...prev,
    //       priceRange: undefined,
    //       "priceRange.from": undefined,
    //       "priceRange.to": undefined,
    //     }));
    //   }

    //   if (value.from > 0 && value.to > 0) {
    //     if (value.from > value.to) {
    //       setErrors((prev) => ({
    //         ...prev,
    //         priceRange: "Minimum price cannot be greater than maximum price",
    //       }));
    //     } else if (value.from === value.to) {
    //       setErrors((prev) => ({
    //         ...prev,
    //         priceRange: "Minimum and maximum price cannot be the same",
    //       }));
    //     }
    //   }
    // }
  };
  // const validateCurrentPage = () => {
  //   const currentPageSchema = Yup.object({
  //     title: Yup.string().required("Job title is required"),
  //     serviceCategory: Yup.string().required("Service category is required"),
  //     location: Yup.object()
  //       .nullable()
  //       .required("Location is required")
  //       .test(
  //         "has-coordinates",
  //         "Location coordinates are required",
  //         (value) => {
  //           return value?.coordinates && value.coordinates.length === 2;
  //         }
  //       ),
  //     preferredDate: Yup.string()
  //       .required("Preferred date is required")
  //       .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  //       .test("future-date", "Date must be today or in the future", (value) => {
  //         const inputDate = new Date(value);
  //         const today = new Date();

  //         // ✅ Set both dates to start of day for accurate comparison
  //         inputDate.setHours(0, 0, 0, 0);
  //         today.setHours(0, 0, 0, 0);

  //         return inputDate >= today;
  //       }),
  //     urgency: Yup.string().required("Please select urgency"),
  //     // ✅ UPDATED VALIDATION: Added min/max value checks
  //     priceRange: Yup.object().test(
  //       "valid-price-config",
  //       "Either set a fixed price range or mark as negotiable",
  //       function (value) {
  //         const { from, to, isPersonalized } = value || {};

  //         const hasAnyPriceValue = from > 0 || to > 0;
  //         const isNegotiable = isPersonalized === true;

  //         // Must have either any price value OR be negotiable
  //         if (!hasAnyPriceValue && !isNegotiable) {
  //           return this.createError({
  //             path: this.path,
  //             message: "Either set a fixed price range or mark as negotiable",
  //           });
  //         }

  //         // ✅ Check if both from and to have values
  //         if (from > 0 && to > 0) {
  //           if (from > to) {
  //             return this.createError({
  //               path: this.path,
  //               message: "Minimum price cannot be greater than maximum price",
  //             });
  //           }

  //           if (from === to) {
  //             return this.createError({
  //               path: this.path,
  //               message: "Minimum and maximum price cannot be the same",
  //             });
  //           }
  //         }

  //         return true;
  //       }
  //     ),
  //     // ✅ ADDED VALIDATION for specificInstructions
  //     specificInstructions: Yup.string()
  //       .required("Specific instructions are required")
  //       .min(10, "Instructions must be at least 10 characters")
  //       .max(500, "Instructions cannot exceed 500 characters")
  //       .test(
  //         "not-just-whitespace",
  //         "Instructions cannot be only whitespace",
  //         (value) => {
  //           return value && value.trim().length > 0;
  //         }
  //       ),
  //     specializations: Yup.array().min(1, "Select at least one specialization"),
  //   });

  //   try {
  //     currentPageSchema.validateSync(jobData, { abortEarly: false });
  //     setErrors({});
  //     return true;
  //   } catch (error) {
  //     const newErrors = {};
  //     error.inner.forEach((err) => {
  //       newErrors[err.path] = err.message;
  //     });
  //     setErrors(newErrors);
  //     return false;
  //   }
  // };
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

    // ✅ Transform jobData before validation
    const transformedData = {
      ...jobData,
      serviceCategory: jobData?.serviceCategory?.id || "",
    };

    try {
      currentPageSchema.validateSync(transformedData, { abortEarly: false });
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
    } else console.log("errors", errors);
  };
  // ✅ UPDATED Conditions - from OR to-তে যেকোনো value থাকলেই disable হবে
  const hasAnyPriceValue =
    jobData.priceRange?.from > 0 || jobData.priceRange?.to > 0;

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
                error={errors.title}
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
              <PriceSlider />
              <Error error={errors.priceRange} />
              <RequestButton
                urgent={isNegotiable}
                onToggleUrgent={(value) => {
                  handleInputChange("priceRange", {
                    ...jobData.priceRange,
                    isPersonalized: value,
                  });
                }}
                disabled={hasAnyPriceValue} // Disable when fixed price set
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
              <Error error={errors.specificInstructions} />
            </View>

            {/* 🧠 Specializations */}
            <View className="px-[6%]">
              <Specializations
                // selected={jobData.specializations}
                onChange={handleInputChange}
              />
              <Error error={errors.specializations} />
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
