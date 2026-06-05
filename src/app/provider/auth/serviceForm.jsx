import { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import CustomHeader from "../../components/auth/CustomHeader";
import DropdownMenu from "../../components/provider/profile/DropdownMenu";
import Specializations from "../../components/tabs/home/Specializations";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { useGetServiceCategoriesQuery } from "../../../redux/features/apiSlices/user/createJobSlices";
import { setProviderRegister } from "../../../redux/features/provider/providerSlice";
import * as Yup from "yup";
import { experienceOptions } from "../../components/data/provider/MapData";
import Error from "../../components/shared/error/Error";
import InstructionField from "../../components/tabs/home/services/provider/InstructionField";
import ServiceAreaSelector from "../../components/auth/ServiceArea";
import ServiceOfferButton from "../../components/shared/services/buttons/ServiceOfferButton";
import { verticalScale } from "../../components/adaptive/Adaptiveness";

const ServicesOfferScreen = () => {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { data, isLoading } = useGetServiceCategoriesQuery();
  const registrationData = useSelector((state) => state.providerRegister);

  const handleInputChange = (field, value) => {
    dispatch(setProviderRegister({ field, value }));

    // ✅ Clear errors when user interacts
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateCurrentPage = () => {
    const currentPageSchema = Yup.object({
      category: Yup.string().required("Service category is required"),
      experience: Yup.string().required("Experience is required"),
      serviceArea: Yup.array()
        .min(1, "Select at least one service area")
        .required("Service area is required"),
      specializations: Yup.array().min(1, "Select at least one specialization"),
      bio: Yup.string()
        .required("Specific instructions are required")
        .min(10, "Instructions must be at least 10 characters")
        .max(500, "Instructions cannot exceed 500 characters")
        .test(
          "not-just-whitespace",
          "Instructions cannot be only whitespace",
          (value) => {
            return value && value.trim().length > 0;
          },
        ),
    });

    const transformedData = registrationData; // Declare the variable here

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

  const handleNext = () => {
    if (validateCurrentPage()) {
      router.replace("/provider/auth/timePicker");
    } else {
    }
  };

  return (
    <View className="flex-1  bg-[#f9f9f9]">
      <CustomHeader title="Services you" nestedTitle="Offer" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 70}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: verticalScale(20) }}
          className="flex-1 "
        >
          <View className="px-[4%] mx-[3%] ">
            <View className="w-full">
              <DropdownMenu
                isLoading={isLoading}
                placeholder="Select Your service"
                options={data?.data?.categories}
                selectedValue={registrationData?.category}
                onSelect={handleInputChange}
                field="category"
                error={errors?.category}
              />

              <DropdownMenu
                placeholder="Select Your Experience"
                options={experienceOptions}
                selectedValue={registrationData?.experience}
                onSelect={handleInputChange}
                field="experience"
                error={errors?.experience}
              />
            </View>

            <ServiceAreaSelector />
            <Error error={errors?.serviceArea} />

            <View className="px-[1%]">
              <Specializations onChange={handleInputChange} />
              <Error error={errors?.specializations} />
            </View>

            {/* 📝 Instructions */}
            <View className="mt-[3%]">
              <InstructionField
                value={registrationData?.bio}
                mode="bio"
                onChangeText={(value) => handleInputChange("bio", value)}
              />
              <Error error={errors?.bio} />
            </View>
          </View>
        </ScrollView>
        <View className="pb-[20%]">
          <ServiceOfferButton onPress={handleNext} title="Next" />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ServicesOfferScreen;
