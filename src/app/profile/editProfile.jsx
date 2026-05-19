import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { toast } from "sonner-native";
import AvatarImagePicker from "../components/tabs/profile/AvatarImagePicker";
import InputField from "../components/tabs/profile/InputField";
import ProfileFormInputs from "../components/tabs/profile/FormInputs";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import { router } from "expo-router";
import {
  useUserProfileQuery,
  useUpdateProfileDataMutation,
} from "../../redux/features/apiSlices/user/userApiSlices";
import LocationPicker from "../components/auth/LocationPicker";
import moment from "moment";
import CustomTitle from "../components/shared/CustomTitle";

export default function EditProfileScreen() {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfileQuery();

  const [updateProfileData, { isLoading: isUpdating }] =
    useUpdateProfileDataMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    location: null,
  });

  useEffect(() => {
    if (profile?.data?.user) {
      const user = profile.data.user;
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth || "",
        location: user.location || null,
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // Check if any changes were made
    const user = profile?.data?.user;

    console.log(
      "formdata",
      formData.fullName,
      formData.phoneNumber,
      formData.dateOfBirth,
    );
    console.log("user", user.fullName, user.phoneNumber, user.dateOfBirth);

    const noChanges =
      formData.fullName === (user?.fullName || "") &&
      formData.phoneNumber === (user?.phoneNumber || "") &&
      formData.dateOfBirth ===
        (user?.dateOfBirth
          ? moment(user.dateOfBirth).utc().format("DD/MM/YYYY")
          : "") &&
      formData.location?.address === (user?.location?.address || "");

    if (noChanges) {
      toast.info("No changes detected. Please update something before saving.");
      return;
    }

    try {
      const updatePayload = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        location: {
          type: "Point",
          coordinates: formData.location?.coordinates || [],
          address: formData.location?.address || "",
          city: formData.location?.city || "",
          state: formData.location?.state || "",
          country: formData.location?.country || "",
          zipCode: formData.location?.zipCode || "",
        },
      };

      console.log("📤 Updating profile with:", updatePayload);

      const response = await updateProfileData(updatePayload).unwrap();

      if (response?.success) {
        toast.success("Profile updated successfully.");
        router.back();
      }
    } catch (error) {
      console.error("❌ Update error:", error);
      toast.error(
        error?.message || "Failed to update profile. Please try again.",
      );
    }
  };

  if (profileLoading) {
    return (
      <View className="flex-1 bg-[#F9F9F9] justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-3 text-gray-600 text-base">Loading profile...</Text>
      </View>
    );
  }

  const { profilePhoto } = profile?.data?.user || {};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 70}
    >
      <CustomTitle title="Edit Profile" withSafeTop={true} />
      <ScrollView
        className="px-[6%] mt-[3%]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <AvatarImagePicker photo={profilePhoto} />

        <View className="mt-[5%]">
          <InputField
            placeholder="Enter your name.."
            label="Name"
            keyboardType="default"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange("fullName", text)}
          />

          <InputField
            placeholder="Enter your email.."
            label="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            editable={false}
          />

          <LocationPicker
            onLocationSelect={(loc) => handleInputChange("location", loc)}
            mode="edit"
            value={formData.location?.address || ""}
          />

          <ProfileFormInputs
            formData={formData}
            onInputChange={handleInputChange}
          />
        </View>
      </ScrollView>

      {/* Fixed Save Button at Bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#F9F9F9] px-[6%] pb-[15%] pt-[3%] border-t border-gray-200">
        <CustomButton
          onPress={handleSave}
          title={isUpdating ? "Saving..." : "Save"}
          disabled={isUpdating}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
