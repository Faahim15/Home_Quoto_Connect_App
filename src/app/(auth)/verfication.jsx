import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import CustomHeader from "../components/auth/CustomHeader";
import VerificationCodeField from "../components/auth/VerificationCode";
import ShortMessage from "../components/auth/ShortMessage";
import { router, useLocalSearchParams } from "expo-router";
import { useVerifyOtpMutation } from "../../redux/features/apiSlices/auth/authApiSlices";
import { useState } from "react";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
export default function VerificationScreen() {
  const [otpVerification, { isLoading }] = useVerifyOtpMutation();
  const { email } = useLocalSearchParams();

  // In VerificationScreen
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // for 6 digits

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
      .required("OTP is required"),
  });
  const handleSubmit = async () => {
    try {
      const fullOtp = otp.join("");

      const data = {
        email: email,
        otp: fullOtp,
        purpose: "forgot-password",
      };

      // ✅ Validate OTP format
      await validationSchema.validate({ otp: fullOtp }, { abortEarly: false });
      setErrors({});

      // ✅ Send request to backend
      const res = await otpVerification(data).unwrap();

      // ✅ If successful
      Toast.show({
        type: "success",
        text1: "OTP Verified Successfully",
        text2: "You can now reset your password.",
        visibilityTime: 2500,
      });

      router.push({
        pathname: "/resetPassword",
        params: { email: data.email, otp: data.otp },
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        // ⚠️ Local form validation error
        const fieldErrors = {};
        error.inner.forEach((err) => {
          fieldErrors[err.path] = err.message;
        });
        setErrors(fieldErrors);

        Toast.show({
          type: "error",
          text1: "Invalid OTP Format",
          text2: "Please enter a valid 4-digit OTP.",
          visibilityTime: 2500,
        });
      } else {
        console.log("error", error);
        // ⚠️ API (backend) errors — e.g., wrong OTP or expired OTP
        const message =
          error?.message === "Invalid OTP"
            ? "The OTP you entered is incorrect. Please try again."
            : error?.data?.message ||
              "Something went wrong. Please try again later.";

        Toast.show({
          type: "error",
          text1: "OTP Verification Failed",
          text2: message,
          visibilityTime: 3000,
        });

        // ❌ Optional: Clear OTP inputs when wrong
        setOtp(["", "", "", "", "", ""]);
      }
    }
  };

  return (
    <View className="flex-1 bg-white ">
      <CustomHeader
        title="Enter Verification"
        nestedTitle="Code"
        subtitle="Enter the code that was sent to your email."
      />
      <VerificationCodeField
        error={errors.otp}
        otp={otp}
        handleOtpChange={handleOtpChange}
      />
      <ShortMessage
        route="ResetPasswordScreen"
        title="Didn't receive the code?"
        btnText="Resend"
      />
      <View className=" flex-1 justify-end pb-[20%]">
        <TouchableOpacity
          onPress={handleSubmit}
          className=" bg-[#0054A5] mx-[6%] rounded-lg py-[4%]"
        >
          <Text className="text-white text-center text-base font-poppins-semiBold ">
            {isLoading ? <ActivityIndicator color="#fff" /> : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
