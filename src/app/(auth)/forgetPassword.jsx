import { View } from "react-native";
import EmailField from "../components/auth/EmailField";
import CustomHeader from "../components/auth/CustomHeader";
import FormButton from "../components/auth/FormButton";
import { useForgotPasswordMutation } from "../../redux/features/apiSlices/auth/authApiSlices";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import * as Yup from "yup";
import { useState } from "react";
export default function ForgetPasswordScreen() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });
  const handleSubmit = async () => {
    try {
      // ✅ Validate form data
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      // ✅ Prepare login payload
      const data = {
        email: formData.email,
      };

      // ✅ Send login request
      const res = await forgotPassword(data).unwrap();
      console.log("forgetPassword response:", res);
      // ✅ Show success toast for verification code sent
      Toast.show({
        type: "success",
        text1: "Verification Code Sent",
        text2: "A code has been sent to your email. Please check your inbox.",
        autoHide: true,
        visibilityTime: 3000,
      });

      // ✅ Navigate to /verification page
      router.push("/verfication");
    } catch (error) {
      // ❌ Show error toast
      Toast.show({
        type: "error",
        text1: "Email Verification Failed",
        text2:
          error?.data?.message || "Something went wrong. Please try again.",
      });

      console.error("Login error:", error);

      // ✅ Optional: handle validation errors
      if (error.name === "ValidationError") {
        const fieldErrors = {};
        error.inner.forEach((err) => {
          fieldErrors[err.path] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <View className="flex-1  bg-[#F9FAFB]  ">
      <CustomHeader
        title="Forget your"
        nestedTitle="Password?"
        subtitle="Enter your email address to reset your password."
      />
      <View className="mx-[6%] mt-[10%]">
        <EmailField
          label="Email"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          error={errors.email}
        />
      </View>
      <FormButton
        isLoading={isLoading}
        title="Get Verification Code"
        onPress={handleSubmit}
      />
    </View>
  );
}
