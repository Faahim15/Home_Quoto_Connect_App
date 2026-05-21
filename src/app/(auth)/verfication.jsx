import { View, Text, ActivityIndicator, Pressable } from "react-native";
import CustomHeader from "../components/auth/CustomHeader";
import VerificationCodeField from "../components/auth/VerificationCode";
import ShortMessage from "../components/auth/ShortMessage";
import { router, useLocalSearchParams } from "expo-router";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "../../redux/features/apiSlices/auth/authApiSlices";
import { useState, useMemo } from "react";
import * as Yup from "yup";
import { toast } from "sonner-native";

// ✅ Moved outside component — not recreated on every render
const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export default function VerificationScreen() {
  const [otpVerification, { isLoading: verifyOtpLoading }] =
    useVerifyOtpMutation();
  const [resendOtp, { isLoading }] = useResendOtpMutation();
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const handleOtpPaste = (digits) => {
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = digits[i] || "";
    }
    setOtp(newOtp);
  };

  const handleResendPassword = async () => {
    try {
      const data = {
        email,
        purpose: "forgot-password",
      };

      const res = await resendOtp(data).unwrap();
      console.log("resend", res, data);
      toast.success("A new OTP has been sent to your email.");
    } catch (error) {
      console.log("Resend OTP Error:", error);
      toast.error(error?.data?.message || "Please try again later.");
    }
  };

  const handleSubmit = async () => {
    try {
      const fullOtp = otp.join("");

      const data = {
        email,
        otp: fullOtp,
        purpose: "forgot-password",
      };

      await validationSchema.validate({ otp: fullOtp }, { abortEarly: false });
      setErrors({});

      await otpVerification(data).unwrap();

      toast.success("OTP verified! You can now reset your password.");

      router.push({
        pathname: "/resetPassword",
        params: { email: data.email, otp: data.otp },
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const fieldErrors = {};
        error.inner.forEach((err) => {
          fieldErrors[err.path] = err.message;
        });
        setErrors(fieldErrors);
        toast.error("Please enter a valid 6-digit OTP.");
      } else {
        console.log("error", error);
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
        title="Enter Verification"
        nestedTitle="Code"
        subtitle="Enter the code that was sent to your email."
      />
      <VerificationCodeField
        error={errors.otp}
        otp={otp}
        handleOtpChange={handleOtpChange}
        handleOtpPaste={handleOtpPaste}
      />
      <ShortMessage
        route="ResetPasswordScreen"
        title="Didn't receive the code?"
        btnText="Resend"
        onPress={handleResendPassword}
      />

      {/*  Fixed: ActivityIndicator সরাসরি Pressable-এর child, Text-এর ভেতরে না */}
      <View className="flex-1 justify-end pb-[20%]">
        <Pressable
          onPress={handleSubmit}
          className="bg-[#0054A5] mx-[6%] rounded-lg py-[4%]"
        >
          {verifyOtpLoading || isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-base font-poppins-semiBold">
              Verify
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
