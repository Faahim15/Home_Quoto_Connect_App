import { View } from "react-native";
import CustomHeader from "../components/auth/CustomHeader";
import PasswordField from "../components/auth/PasswordField";
import FormButton from "../components/auth/FormButton";
import SuccessModal from "../components/shared/modal/SuccessModal";
import { useEffect, useState } from "react";
import { useResetPasswordMutation } from "../../redux/features/apiSlices/auth/authApiSlices";
import { router, useLocalSearchParams } from "expo-router";
import * as Yup from "yup";

export default function ResetPasswordScreen() {
  // const [showModal, setShowModal] = useState(false);
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
      console.log("formData", formData);
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
      console.log("Reset password:", res);

      // Step 4: Handle success
      if (res?.success) {
        Toast.show({
          type: "success",
          text1: "Password Reset Successful 🎉",
          text2: res?.message || "Your password has been updated successfully.",
          visibilityTime: 2500,
        });
        setTimeout(() => {
          router.push("/signIn");
        }, 2000);
      }
    } catch (err) {
      console.log("err", err);
      // Step 6: Handle validation or network errors
      if (err?.message === "Invalid or expired OTP") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        console.log("API Error:", err);
        const errorMessage =
          err?.message || "Unable to reset password. Please try again.";

        Toast.show({
          type: "error",
          text1: "Reset Failed ❌",
          text2: errorMessage,
          visibilityTime: 2500,
        });
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
          error={errors.password}
          label="Confirm New Password"
        />
      </View>
      <FormButton title="Save Password" onPress={handleSubmit} />
      {/* <SuccessModal visible={showModal} /> */}
    </View>
  );
}
