import { View } from "react-native";
import CustomHeader from "../components/auth/CustomHeader";
import PasswordField from "../components/auth/PasswordField";
import FormButton from "../components/auth/FormButton";
import SuccessModal from "../components/shared/modal/SuccessModal";
import { useEffect, useState } from "react";
import { useResetPasswordMutation } from "../../redux/features/apiSlices/auth/authApiSlices";
import { router, useLocalSearchParams } from "expo-router";
import * as Yup from "yup";
import { toast } from "sonner-native";

export default function ResetPasswordScreen() {
  const { email, otp } = useLocalSearchParams();
  const [passwordReset, { isLoading }] = useResetPasswordMutation();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async () => {
    try {
      // Step 1: Validate user input
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      // Step 2: Prepare payload
      const data = {
        email: email,
        otp: otp,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      // Step 3: Call API
      const res = await passwordReset(data).unwrap();

      // Step 4: Handle success
      if (res?.success) {
        toast.success(
          res?.message || "Your password has been updated successfully.",
        );

        router.replace("/onboarding/loginChoice");
      }
    } catch (err) {
      // Step 6: Handle validation or network errors
      if (err?.message === "Invalid or expired OTP") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        const errorMessage =
          err?.message || "Unable to reset password. Please try again.";

        toast.error(
          err?.message || "Unable to reset password. Please try again.",
        );
      }
    }
  };

  // useEffect(() => {
  //   if (showModal) {
  //     const timer = setTimeout(() => {
  //       setShowModal(false);
  //       router.push("/onboarding/loginChoice");
  //     }, 3000); // 3 seconds

  //     return () => clearTimeout(timer);
  //   }
  // }, [showModal]);

  // const handleSavePassword = () => {
  //   setShowModal(true);
  // };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <CustomHeader
        title="Now reset Your"
        nestedTitle="Password"
        subtitle="Enter the code that was sent to your email."
      />
      <View className="mx-[6.4%] mt-[8%]">
        <PasswordField
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          error={errors.password}
          label="New Password"
        />
        <PasswordField
          value={formData.confirmPassword}
          onChangeText={(text) => handleInputChange("confirmPassword", text)}
          error={errors.confirmPassword}
          label="Confirm New Password"
        />
      </View>
      <FormButton
        isLoading={isLoading}
        title="Save Password"
        onPress={handleSubmit}
      />
      {/* <SuccessModal visible={showModal} /> */}
    </View>
  );
}
