import {
  Platform,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

import CustomTitle from "../../components/shared/CustomTitle";
import DropdownMenu from "../../components/provider/profile/DropdownMenu";
import Specializations from "../../components/tabs/home/Specializations";
import AvailableTime from "../../components/provider/profile/AvailableTime";
import InstructionField from "../../components/tabs/home/services/provider/InstructionField";
import ServiceAreaSelector from "../../components/auth/ServiceArea";
import ProfileButton from "../../components/shared/services/buttons/ProfileButton";

import { useGetServiceCategoriesQuery } from "../../../redux/features/apiSlices/user/createJobSlices";
import {
  useUpdateProfileDataMutation,
  useUserProfileQuery,
} from "../../../redux/features/apiSlices/user/userApiSlices";

import { setProviderRegister } from "../../../redux/features/provider/providerSlice";

import CANADIAN_PROVINCES, {
  convertTo24Hour,
  formatTime,
  experienceOptions,
} from "../../components/data/provider/ServiceData";
import { verticalScale } from "../../components/adaptive/Adaptiveness";

export default function ServiceScreen() {
  const dispatch = useDispatch();

  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [showPicker, setShowPicker] = useState({ type: null, show: false });

  const serviceAreasFromRedux = useSelector(
    (state) => state.providerRegister.serviceArea || []
  );

  const { data, isLoading } = useGetServiceCategoriesQuery();
  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useUserProfileQuery();

  const [updateProfileData, { isLoading: isUpdating }] =
    useUpdateProfileDataMutation();

  const [formData, setFormData] = useState({
    category: "",
    specializations: [],
    workingHours: { from: "", to: "" },
    experience: "",
    serviceAreas: [],
    bio: "",
  });

  // Sync Redux service areas to local formData
  useEffect(() => {
    if (serviceAreasFromRedux.length > 0) {
      const areaNames = serviceAreasFromRedux.map((a) => a.name);
      setFormData((prev) => ({ ...prev, serviceAreas: areaNames }));
    }
  }, [serviceAreasFromRedux]);

  // Load profile data
  useEffect(() => {
    if (!profile?.data?.user) return;

    const user = profile.data.user;

    const transformedSpecializations =
      user.specializations?.map((spec) => ({
        id: spec._id,
        title: spec.title,
        category: spec.category,
      })) || [];

    const transformedServiceAreas =
      user.serviceAreas?.map((area) => {
        const province = CANADIAN_PROVINCES.find((p) => p.name === area);
        return province || { id: area, name: area };
      }) || [];

    const experienceMap = {
      beginner: "Beginner (0-1 years)",
      intermediate: "Intermediate (2-3 years)",
      advanced: "Advanced (4-5 years)",
      expert: "Expert (6+ years)",
    };

    setFormData({
      category: user.businessName || "",
      specializations: transformedSpecializations,
      workingHours: user.workingHours || { from: "", to: "" },
      experience: experienceMap[user.experienceLevel?.toLowerCase()] || "",
      serviceAreas: user.serviceAreas || [],
      bio: user.bio || "",
    });

    // Time formatting
    if (user.workingHours?.from) {
      const [h, m] = user.workingHours.from.split(":");
      const d = new Date();
      d.setHours(parseInt(h), parseInt(m));
      setFromTime(d);
    }

    if (user.workingHours?.to) {
      const [h, m] = user.workingHours.to.split(":");
      const d = new Date();
      d.setHours(parseInt(h), parseInt(m));
      setToTime(d);
    }

    // Update Redux for ServiceAreaSelector
    if (transformedServiceAreas.length > 0) {
      dispatch(
        setProviderRegister({
          field: "serviceArea",
          value: transformedServiceAreas,
        })
      );
    }
  }, [profile]);

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const openTimePicker = (type) => {
    setShowPicker({ type, show: true });
  };

  const handleTimeChange = (_, selectedDate) => {
    if (selectedDate) {
      const timeString = convertTo24Hour(selectedDate);

      if (showPicker.type === "from") {
        setFromTime(selectedDate);
        setFormData((p) => ({
          ...p,
          workingHours: { ...p.workingHours, from: timeString },
        }));
      } else if (showPicker.type === "to") {
        setToTime(selectedDate);
        setFormData((p) => ({
          ...p,
          workingHours: { ...p.workingHours, to: timeString },
        }));
      }
    }
    setShowPicker({ type: null, show: false });
  };

  const handleSave = async () => {
    try {
      const specializationIds = formData.specializations.map((s) => s.id);

      const categoryObj = data?.data?.categories?.find(
        (c) => c.title === formData.category
      );

      await updateProfileData({
        businessName: categoryObj?.title,
        specializations: specializationIds,
        workingHours: formData.workingHours,
        experienceLevel: formData.experience.split(" ")[0].toLowerCase(),
        serviceAreas: formData.serviceAreas,
        bio: formData.bio,
      }).unwrap();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Service information updated successfully",
      });

      refetchProfile();
      router.back();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.data?.message || "Failed to update information",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View className="flex-1 bg-[#F9F9F9]">
        <ScrollView
          className="flex-1 px-[6%]"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(40) }}
        >
          {/* <CustomTitle title="Service" /> */}

          {/* Service Category */}
          <View className="mt-[3%]">
            <Text className="font-poppins-semiBold text-base text-[#6B7280]">
              Service name
            </Text>

            <DropdownMenu
              isLoading={isLoading}
              placeholder="Select Your service"
              options={data?.data?.categories}
              selectedValue={formData.category}
              onSelect={handleInputChange}
              field="category"
            />
          </View>

          {/* Specializations */}
          <Specializations
            selected={formData.specializations}
            onChange={handleInputChange}
          />

          {/* Working Hours */}
          <View className="mt-[3%]">
            <Text className="font-poppins-semiBold text-base text-[#6B7280]">
              Service Timing
            </Text>
          </View>

          <View className="flex-row mt-[3%] justify-between">
            <AvailableTime
              label="From"
              time={formatTime(fromTime)}
              onPress={() => openTimePicker("from")}
            />
            <AvailableTime
              label="To"
              time={formatTime(toTime)}
              onPress={() => openTimePicker("to")}
            />

            {showPicker.show && (
              <DateTimePicker
                value={
                  showPicker.type === "from" && fromTime
                    ? fromTime
                    : showPicker.type === "to" && toTime
                      ? toTime
                      : new Date()
                }
                mode="time"
                is24Hour
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleTimeChange}
              />
            )}
          </View>

          {/* Experience */}
          <View className="mt-[3%]">
            <Text className="font-poppins-semiBold text-base text-[#6B7280]">
              Experience
            </Text>

            <DropdownMenu
              placeholder="Select Your Experience"
              options={experienceOptions}
              selectedValue={formData.experience}
              onSelect={handleInputChange}
              field="experience"
            />
          </View>

          {/* Service Area */}
          <ServiceAreaSelector />

          {/* Bio */}
          <View className="mt-[3%]">
            <InstructionField
              value={formData.bio}
              mode="bio"
              onChangeText={(value) => handleInputChange("bio", value)}
            />
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="pb-[10%] ">
          <ProfileButton
            onPress={handleSave}
            title={isUpdating ? "Saving..." : "Save"}
            disabled={isUpdating || profileLoading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
