import { View, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import PasswordField from "../components/auth/PasswordField";
import CustomTitle from "../components/shared/services/CustomTitle";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import { router } from "expo-router";
import { useChangePasswordMutation } from "../../redux/features/apiSlices/auth/authApiSlices";
import { useState } from "react";
import * as Yup from "yup";
import Toast from "react-native-toast-message";

export default function ChangePasswordScreen() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  console.log("show", formData);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string() // Updated field name
      .required("Current password is required")
      .min(8, "Current password must be at least 8 characters"),

    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "New password must be at least 8 characters")
      .notOneOf(
        [Yup.ref("currentPassword")],
        "New password cannot be the same as current password"
      ),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords do not match")
      .required("Please confirm your new password"),
  });

  const handleSubmit = async () => {
    try {
      // Step 1: Validate user input
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      // Step 2: Prepare payload with correct structure
      const payload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      console.log("Sending payload:", payload);

      // Step 3: Call change password API
      const res = await changePassword(payload).unwrap();
      console.log("Password changed successfully:", res);

      // Step 4: Handle success
      if (res?.success) {
        Toast.show({
          type: "success",
          text1: "Password Updated Successfully 🔒",
          text2:
            "Your password has been changed successfully. Please use your new password for future logins.",
          visibilityTime: 3000,
        });

        // Clear form and navigate back
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        router.back();
      }
    } catch (err) {
      console.log("Error changing password:", err);

      // Step 5: Handle validation errors (Yup validation errors)
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);

        // Show validation error toast
        Toast.show({
          type: "error",
          text1: "Please Check Your Input",
          text2: "There are errors in the form. Please review and try again.",
          visibilityTime: 3000,
        });
      }
      // Step 6: Handle API error - Incorrect current password
      else if (
        err?.data?.message === "Current password is incorrect" ||
        err?.message === "Current password is incorrect"
      ) {
        setErrors({ currentPassword: "Current password is incorrect" });

        Toast.show({
          type: "error",
          text1: "Incorrect Current Password",
          text2:
            "The current password you entered is incorrect. Please check and try again.",
          visibilityTime: 3000,
        });
      }
      // Step 7: Handle other API errors
      else if (err?.message) {
        Toast.show({
          type: "error",
          text1: "Unable to Change Password",
          text2: err?.message,
          visibilityTime: 3000,
        });
      }
      // Step 8: Handle generic/network errors
      else {
        Toast.show({
          type: "error",
          text1: "Something Went Wrong",
          text2:
            "We encountered an issue while changing your password. Please check your connection and try again.",
          visibilityTime: 3000,
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        className="flex-1 px-[6%] bg-[#F9F9f9]"
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <CustomTitle title="Change Password" />
        </View>

        <View className="flex-1 mt-[6%]">
          <PasswordField
            value={formData.currentPassword} // Updated field name
            onChangeText={(text) => handleInputChange("currentPassword", text)} // Updated field name
            error={errors.currentPassword} // Updated field name
            placeholder="Enter current password"
            label="Current Password"
          />
          <PasswordField
            value={formData.newPassword}
            onChangeText={(text) => handleInputChange("newPassword", text)}
            error={errors.newPassword}
            placeholder="Enter new password"
            label="New Password"
          />
          <PasswordField
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange("confirmPassword", text)}
            error={errors.confirmPassword}
            placeholder="Confirm your new password"
            label="Confirm New Password"
          />
        </View>
      </ScrollView>
      <View className="px-[6%] pb-[15%] bg-[#F9F9f9]">
        <CustomButton
          onPress={handleSubmit}
          title="Update Password"
          isLoading={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
