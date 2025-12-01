import { Platform, Text, View, ScrollView } from "react-native";
import CustomTitle from "../../components/shared/CustomTitle";
import DropdownMenu from "../../components/provider/profile/DropdownMenu";
import { useEffect, useState } from "react";
import Specializations from "../../components/tabs/home/Specializations";
import AvailableTime from "../../components/provider/profile/AvailableTime";
import DateTimePicker from "@react-native-community/datetimepicker";
import FormButton from "../../components/auth/FormButton";
import { router } from "expo-router";
import { useGetServiceCategoriesQuery } from "../../../redux/features/apiSlices/user/createJobSlices";
import ServiceAreaSelector from "../../components/auth/ServiceArea";
import {
  useUpdateProfileDataMutation,
  useUserProfileQuery,
} from "../../../redux/features/apiSlices/user/userApiSlices";
import { useSelector, useDispatch } from "react-redux";
import { setProviderRegister } from "../../../redux/features/provider/providerSlice";
import CANADIAN_PROVINCES from "../../components/data/provider/ServiceData";
import {
  convertTo24Hour,
  formatTime,
  experienceOptions,
} from "../../components/data/provider/ServiceData";
import InstructionField from "../../components/tabs/home/services/provider/InstructionField";
import Toast from "react-native-toast-message";
import ProfileButton from "../../components/shared/services/buttons/ProfileButton";

export default function ServiceScreen() {
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [showPicker, setShowPicker] = useState({ type: null, show: false });

  // Add this near the top with other hooks
  const dispatch = useDispatch();
  const serviceAreasFromRedux = useSelector(
    (state) => state.providerRegister.serviceArea || []
  );
  const { data, isLoading } = useGetServiceCategoriesQuery();
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfileQuery();

  const [updateProfileData, { isLoading: isUpdating }] =
    useUpdateProfileDataMutation();

  // State for form fields
  const [formData, setFormData] = useState({
    category: "",
    specializations: [],
    workingHours: {
      from: "",
      to: "",
    },
    experience: "",
    serviceAreas: [],
    bio: "",
  });

  useEffect(() => {
    // Sync Redux serviceArea to formData whenever it changes
    if (serviceAreasFromRedux.length > 0) {
      const serviceAreaNames = serviceAreasFromRedux.map((area) => area.name);
      setFormData((prev) => ({
        ...prev,
        serviceAreas: serviceAreaNames,
      }));
    }
  }, [serviceAreasFromRedux]);

  // Load profile data into form state
  useEffect(() => {
    if (profile?.data?.user) {
      const user = profile.data.user;
      const transformedSpecializations =
        user.specializations?.map((spec) => ({
          id: spec._id,
          title: spec.title,
          category: spec.category,
        })) || [];

      // Transform serviceAreas to match the format expected by ServiceAreaSelector
      const transformedServiceAreas =
        user.serviceAreas?.map((area) => {
          // Find the matching province from CANADIAN_PROVINCES
          const province = CANADIAN_PROVINCES.find((p) => p.name === area);
          return province || { id: area, name: area };
        }) || [];

      // Helper function to map experience level to display text
      const getExperienceDisplay = (level) => {
        const mapping = {
          beginner: "Beginner (0-1 years)",
          intermediate: "Intermediate (2-3 years)",
          advanced: "Advanced (4-5 years)",
          expert: "Expert (6+ years)",
        };
        return mapping[level?.toLowerCase()] || "";
      };

      setFormData({
        category: user?.businessName || "",
        specializations: transformedSpecializations || [],
        workingHours: {
          from: user.workingHours?.from || "",
          to: user.workingHours?.to || "",
        },
        experience: getExperienceDisplay(user.experienceLevel) || "",
        serviceAreas: user.serviceAreas || [],
        bio: user.bio || "",
      });

      // Load existing working hours into state
      if (user.workingHours?.from) {
        const [hours, minutes] = user.workingHours.from.split(":");
        const fromDate = new Date();
        fromDate.setHours(parseInt(hours), parseInt(minutes));
        setFromTime(fromDate);
      }

      if (user.workingHours?.to) {
        const [hours, minutes] = user.workingHours.to.split(":");
        const toDate = new Date();
        toDate.setHours(parseInt(hours), parseInt(minutes));
        setToTime(toDate);
      }

      // Dispatch existing service areas to Redux so ServiceAreaSelector shows them
      if (transformedServiceAreas.length > 0) {
        dispatch(
          setProviderRegister({
            field: "serviceArea",
            value: transformedServiceAreas,
          })
        );
      }
    }
  }, [profile]);

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openTimePicker = (type) => {
    setShowPicker({ type, show: true });
  };

  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      const updatedTime = selectedDate;
      const timeString = convertTo24Hour(updatedTime);

      if (showPicker.type === "from") {
        setFromTime(updatedTime);
        setFormData((prev) => ({
          ...prev,
          workingHours: {
            ...prev.workingHours,
            from: timeString,
          },
        }));
      } else if (showPicker.type === "to") {
        setToTime(updatedTime);
        setFormData((prev) => ({
          ...prev,
          workingHours: {
            ...prev.workingHours,
            to: timeString,
          },
        }));
      }
    }
    setShowPicker({ type: null, show: false });
  };

  // console.log("formdata", formData);

  const handleSave = async () => {
    try {
      // Extract only specialization IDs
      const specializationIds = formData.specializations.map((spec) => spec.id);

      // Find category ID from the categories data
      const selectedCategory = data?.data?.categories?.find(
        (cat) => cat.title === formData.category
      );
      const categoryId = selectedCategory?.title;

      const response = await updateProfileData({
        businessName: categoryId, // Send category ID as businessName
        specializations: specializationIds, // Send only specialization IDs
        workingHours: formData.workingHours,
        experienceLevel: formData?.experience
          ?.split(" ")
          .slice(0, 1)
          .join("")
          .toLowerCase(),
        serviceAreas: formData.serviceAreas,
        bio: formData.bio,
      }).unwrap();

      console.log("show response from service", response);

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Service information updated successfully",
        position: "top",
        visibilityTime: 3000,
      });

      // Refetch profile to get updated data
      refetchProfile();

      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);

      // Show error toast
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.data?.message || "Failed to update service information",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <ScrollView
        className="flex-1 px-[6%]"
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View>
          <CustomTitle title="Service" />
        </View>

        <View className="mt-[3%]">
          <Text className="font-poppins-semiBold text-base text-[#6B7280]">
            Service name
          </Text>
          <View className="mt-[1%]">
            <DropdownMenu
              isLoading={isLoading}
              placeholder="Select Your service"
              options={data?.data?.categories}
              selectedValue={formData?.category}
              onSelect={handleInputChange}
              field="category"
            />
          </View>
        </View>

        {/* Specializations */}
        <View className="">
          <Specializations
            selected={formData.specializations}
            onChange={handleInputChange}
          />
        </View>

        {/* Available */}
        <View className="mt-[3%]">
          <Text className="font-poppins-semiBold text-base text-[#6B7280]">
            Service Timing
          </Text>
        </View>

        <View className="flex-row mt-[3%] w-full justify-between">
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

          {/* Time Picker */}
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
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Experience in years */}
        <View className="mt-[3%]">
          <Text className="font-poppins-semiBold text-base text-[#6B7280]">
            Experience
          </Text>
          <View className="mt-[1%]">
            <DropdownMenu
              placeholder="Select Your Experience"
              options={experienceOptions}
              selectedValue={formData?.experience}
              onSelect={handleInputChange}
              field="experience"
            />
          </View>
        </View>

        {/* Service Area */}
        <View className="mt-[0%]">
          <View className="mt-[0%]">
            <ServiceAreaSelector />
          </View>
        </View>

        {/* Bio */}
        <View className="mt-[3%]">
          <InstructionField
            value={formData?.bio}
            mode="bio"
            onChangeText={(value) => handleInputChange("bio", value)}
          />
        </View>
      </ScrollView>
      {/* Button outside ScrollView */}
      <View className="pb-[10%]">
        <ProfileButton
          onPress={handleSave}
          title={isUpdating ? "Saving..." : "Save"}
          disabled={isUpdating || profileLoading}
        />
      </View>
    </View>
  );
}
