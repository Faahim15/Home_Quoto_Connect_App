import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import CustomHeader from "../components/auth/CustomHeader";
import VerificationCodeField from "../components/auth/VerificationCode";
import { router, useLocalSearchParams } from "expo-router";
import { useVerifyOtpMutation } from "../../redux/features/apiSlices/auth/authApiSlices";
import { useState } from "react";
import * as Yup from "yup";
import { toast } from "sonner-native";

export default function VerificationScreen() {
  const [otpVerification, { isLoading: verifyOtpLoading }] =
    useVerifyOtpMutation();
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
      router.dismissAll();
      router.replace("/signIn");
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
        title="Verify Your Account"
        nestedTitle="Code"
        arrowBack={false}
        subtitle="Enter the code sent to your email to complete sign-up."
      />

      <VerificationCodeField
        error={errors.otp}
        otp={otp}
        handleOtpChange={handleOtpChange}
        handleOtpPaste={handleOtpPaste}
      />

      <View className="flex-1 justify-end pb-[20%]">
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-[#0054A5] mx-[6%] rounded-lg py-[4%]"
        >
          <Text className="text-white text-center text-base font-poppins-semiBold">
            {verifyOtpLoading ? <ActivityIndicator color="#fff" /> : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
