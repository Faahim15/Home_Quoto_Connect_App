import {
  Platform,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { toast } from "sonner-native";
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
    (state) => state.providerRegister.serviceArea || [],
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

    if (transformedServiceAreas.length > 0) {
      dispatch(
        setProviderRegister({
          field: "serviceArea",
          value: transformedServiceAreas,
        }),
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
    // Android এ auto close, iOS এ Done button এ close
    if (Platform.OS === "android") {
      setShowPicker({ type: null, show: false });
    }
  };

  const handleSave = async () => {
    const user = profile?.data?.user;

    const noChanges =
      formData.category === (user?.businessName || "") &&
      formData.bio === (user?.bio || "") &&
      formData.experience.split(" ")[0].toLowerCase() ===
        (user?.experienceLevel?.toLowerCase() || "") &&
      formData.workingHours.from === (user?.workingHours?.from || "") &&
      formData.workingHours.to === (user?.workingHours?.to || "") &&
      JSON.stringify(formData.serviceAreas.slice().sort()) ===
        JSON.stringify((user?.serviceAreas || []).slice().sort()) &&
      JSON.stringify(
        formData.specializations
          .map((s) => s.id)
          .slice()
          .sort(),
      ) ===
        JSON.stringify(
          (user?.specializations || [])
            .map((s) => s._id)
            .slice()
            .sort(),
        );

    if (noChanges) {
      toast.info("No changes detected. Please update something before saving.");
      return;
    }

    try {
      const specializationIds = formData.specializations.map((s) => s.id);

      const categoryObj = data?.data?.categories?.find(
        (c) => c.title === formData.category,
      );

      await updateProfileData({
        businessName: categoryObj?.title,
        specializations: specializationIds,
        workingHours: formData.workingHours,
        experienceLevel: formData.experience.split(" ")[0].toLowerCase(),
        serviceAreas: formData.serviceAreas,
        bio: formData.bio,
      }).unwrap();

      toast.success("Service information updated successfully.");

      refetchProfile();
      router.back();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Failed to update service information. Please try again.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View className="flex-1 bg-[#F9F9F9]">
        <CustomTitle title="My Services" withSafeTop={true} />

        <ScrollView
          className="flex-1 px-[6%]"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(40) }}
        >
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
        <View className="pb-[20%]">
          <ProfileButton
            onPress={handleSave}
            title={isUpdating ? "Saving..." : "Save"}
            disabled={isUpdating || profileLoading}
          />
        </View>
      </View>

      {/* iOS Time Picker Modal */}
      {Platform.OS === "ios" && (
        <Modal
          transparent
          animationType="slide"
          visible={showPicker.show}
          onRequestClose={() => setShowPicker({ type: null, show: false })}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.35)",
              justifyContent: "flex-end",
            }}
            onPress={() => setShowPicker({ type: null, show: false })}
          >
            <Pressable>
              <View
                style={{
                  backgroundColor: "white",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  paddingBottom: 34,
                }}
              >
                {/* Modal Header */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: "#E5E7EB",
                  }}
                >
                  <Pressable
                    onPress={() => setShowPicker({ type: null, show: false })}
                  >
                    <Text style={{ color: "#6B7280", fontSize: 16 }}>
                      Cancel
                    </Text>
                  </Pressable>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#1A1A1A",
                    }}
                  >
                    {showPicker.type === "from" ? "Start Time" : "End Time"}
                  </Text>
                  <Pressable
                    onPress={() => setShowPicker({ type: null, show: false })}
                  >
                    <Text
                      style={{
                        color: "#319FCA",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      Done
                    </Text>
                  </Pressable>
                </View>

                {/* Picker */}
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
                  display="spinner"
                  onChange={handleTimeChange}
                  locale="en_CA"
                  style={{ width: "100%" }}
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* Android Time Picker */}
      {Platform.OS === "android" && showPicker.show && (
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
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </KeyboardAvoidingView>
  );
}
