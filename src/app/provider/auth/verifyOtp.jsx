import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import CustomHeader from "../../components/auth/CustomHeader";
import VerificationCodeField from "../../components/auth/VerificationCode";
import { useVerifyOtpMutation } from "../../../redux/features/apiSlices/auth/authApiSlices";

export default function VerifyOtp() {
  const [otpVerification, { isLoading: verifyOtpLoading }] =
    useVerifyOtpMutation();
  const { email } = useLocalSearchParams();

  console.log("email from provider sign up", email);

  // OTP state (6 digits)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  }; 
  // VerifyOtp.jsx এ এই function টা add করুন
const handleOtpPaste = (digits) => {
  const newOtp = [...otp];
  for (let i = 0; i < 6; i++) {
    newOtp[i] = digits[i] || "";
  }
  setOtp(newOtp); // ✅ একবারে পুরো array update
};

  // ✅ Validation schema
  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
      .required("OTP is required"),
  });

  const handleSubmit = async (currentOtp = otp) => {
    try {
    const fullOtp = currentOtp.join("");

      console.log("show emial and otp", email, otp);

    const data = {
      email,
      otp: fullOtp,
      purpose: "signup",
    };


      // ✅ Validate OTP format
  await validationSchema.validate({ otp: fullOtp }, { abortEarly: false });
    setErrors({})

      // ✅ Send request to backend
      await otpVerification(data).unwrap();

      // ✅ Success
      Toast.show({
        type: "success",
        text1: "Account Verified",
        text2: "Your account has been verified successfully.",
        visibilityTime: 2500,
      });

      // 🔑 Navigate to next step after sign-up verification
      router.replace("provider/auth/signIn"); // adjust to your actual route
    } catch (error) {
      if (error.name === "ValidationError") {
        const fieldErrors = {};
        error.inner.forEach((err) => {
          fieldErrors[err.path] = err.message;
        });
        setErrors(fieldErrors);

        Toast.show({
          type: "error",
          text1: "Invalid OTP Format",
          text2: "Please enter a valid 6-digit OTP.",
          visibilityTime: 2500,
        });
      } else {
        console.log("error", error);
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

      <VerificationCodeField
        error={errors.otp}
        otp={otp}
        handleOtpChange={handleOtpChange}  
         handleOtpPaste={handleOtpPaste}
      
      />

      <View className="flex-1 justify-end pb-[20%]">
        <TouchableOpacity
          onPress={() => handleSubmit()} 
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
