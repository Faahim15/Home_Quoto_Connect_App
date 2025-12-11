// EditProfileScreen
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import CustomTitle from "../components/shared/services/CustomTitle";
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

export default function EditProfileScreen() {
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
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    location: null,
  });

  // Load profile data into form state
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

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle save/update
  const handleSave = async () => {
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
        Alert.alert("Success", "Profile updated successfully!");
        router.back();
      }
    } catch (error) {
      console.error("❌ Update error:", error);
      Alert.alert(
        "Update Failed",
        error?.message || "Failed to update profile. Please try again."
      );
    }
  };

  // Show loading indicator when profile is being fetched
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
      <ScrollView
        className="px-[6%]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <CustomTitle title="Edit Profile" />

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
            editable={false} // Email usually shouldn't be editable
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
      <View className="absolute bottom-0 left-0 right-0 bg-[#F9F9F9] px-[6%] pb-[5%] pt-[3%] border-t border-gray-200">
        <CustomButton
          onPress={handleSave}
          title={isUpdating ? "Saving..." : "Save"}
          disabled={isUpdating}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
