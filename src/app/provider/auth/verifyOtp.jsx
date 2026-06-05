import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import * as Yup from "yup";
import { toast } from "sonner-native";
import CustomHeader from "../../components/auth/CustomHeader";
import VerificationCodeField from "../../components/auth/VerificationCode";
import { useVerifyOtpMutation } from "../../../redux/features/apiSlices/auth/authApiSlices";
import FormButton from "../../components/auth/FormButton";

export default function VerifyOtp() {
  const [otpVerification, { isLoading: verifyOtpLoading }] =
    useVerifyOtpMutation();
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});

  // ✅ This receives the full otp array from VerificationCodeField
  const handleOtpChange = (otpArray) => {
    setOtp(otpArray);
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
      .required("OTP is required"),
  });

  const handleSubmit = async () => {
    try {
      const fullOtp = otp.join("");

      const data = {
        email,
        otp: fullOtp,
        purpose: "signup",
      };

      await validationSchema.validate({ otp: fullOtp }, { abortEarly: false });
      setErrors({});

      await otpVerification(data).unwrap();

      toast.success("Your account has been verified successfully.");
      router.replace("provider/auth/signIn");
    } catch (error) {
      if (error.name === "ValidationError") {
        const fieldErrors = {};
        error.inner.forEach((err) => {
          fieldErrors[err.path] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("Please enter a valid 6-digit OTP.");
      } else {
        const message =
          error?.message === "Invalid OTP"
            ? "The OTP you entered is incorrect. Please try again."
            : error?.data?.message ||
              "Something went wrong. Please try again later.";
        toast.error(message);
        setOtp(["", "", "", "", "", ""]);
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      <CustomHeader
        title="Verify Your Account"
        nestedTitle="Code"
        subtitle="Enter the code sent to your email to complete sign-up."
      />

      {/* ✅ Pass onOtpChange instead of handleOtpChange/handleOtpPaste */}
      <VerificationCodeField error={errors.otp} onOtpChange={handleOtpChange} />

      <View className="flex-1 justify-end pb-[20%]">
        <FormButton
          onPress={handleSubmit}
          title="Verify"
          isLoading={verifyOtpLoading}
        />
      </View>
    </View>
  );
}
