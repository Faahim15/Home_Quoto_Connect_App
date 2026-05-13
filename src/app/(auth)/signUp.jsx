import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "../components/adaptive/Adaptiveness";
import TextField from "../components/auth/TextField";
import EmailField from "../components/auth/EmailField";
import PasswordField from "../components/auth/PasswordField";
import ArrowBack from "../components/auth/ArrowBack";
import LocationPicker from "../components/auth/LocationPicker";
import { router } from "expo-router";
import * as Yup from "yup";
import { toast } from "sonner-native";
import { useRegisterUserMutation } from "../../redux/features/apiSlices/auth/authApiSlices";
import PhoneInput from "../components/auth/PhoneNumber";
import AgreeWithTerms from "../components/auth/AgreeWithTerms";

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const location = {
    type: "Point",
    coordinates: formData.location?.coordinates || [],
    address: formData.location?.address || "",
    city: formData.location?.city || "",
    state: formData.location?.state || "",
    country: formData.location?.country || "",
    zipCode: formData.location?.zipCode || "",
  };
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    phone: Yup.string()
      .required("Phone number is required")
      .test(
        "is-valid-canadian-phone",
        "Please enter a valid 10-digit phone number",
        (value) => {
          if (!value) return false;
          const cleaned = value.replace(/\D/g, "");
          return cleaned.length === 10;
        },
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    location: Yup.object()
      .nullable()
      .required("Location is required")
      .test("has-coordinates", "Location coordinates are required", (value) => {
        return value?.coordinates && value.coordinates.length === 2;
      }),
  });

  const handleSubmit = async () => {
    try {
      // Step 1: Validate user input
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      // Step 2: Prepare payload
      const formsData = new FormData();
      formsData.append("role", "client");
      formsData.append("fullName", formData.fullName);
      formsData.append("email", formData.email);
      formsData.append("password", formData.password);
      formsData.append("confirmPassword", formData.confirmPassword);
      formsData.append("phoneNumber", formData.phone);
      formsData.append("location", JSON.stringify(location));
      formsData.append("timezone", formData.timezone);

      const res = await registerUser(formsData).unwrap();

      console.log({ res });

      // Step 4: Handle success
      if (res?.success) {
        toast.success(
          res?.message ||
            "User registered successfully. Please check your email for verification code.",
        );
        router.replace({
          pathname: "/verifySignup",
          params: { email: formData.email },
        });
      } else {
        toast.error(res?.message || "Registration failed.");
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        console.log("API Errora:", err);
        const errorMessage =
          err?.message ||
          err?.data?.email?.[0] ||
          err?.error ||
          "Network or server error. Please try again.";

        toast.error(
          err?.data?.message ||
            err?.message ||
            "Network or server error. Please try again.",
        );
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : verticalScale(20)}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: verticalScale(20) }}
        >
          <ArrowBack />

          {/* Welcome Section */}
          <View className="mt-[1.5%] justify-center items-center">
            <Text className="font-poppins-500medium text-2xl text-[#292929]">
              Welcome Here!
            </Text>
            <Text className="font-poppins-500medium text-2xl text-[#319FCA]">
              Create An Account.
            </Text>
            <Text className="font-poppins-500medium text-sm text-[#292929]">
              Fill In your Information.
            </Text>
          </View>

          {/* Form Section */}
          <View className="h-[55%] px-[6%] justify-between">
            <TextField
              color="#f9f9f9"
              label="Full Name"
              placeholder="Full name"
              IconName="person-outline"
              value={formData.fullName}
              onChangeText={(text) => handleInputChange("fullName", text)}
              error={errors.fullName}
            />

            <EmailField
              label="Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              error={errors.email}
            />

            <LocationPicker
              onLocationSelect={(loc) => handleInputChange("location", loc)}
              error={errors.location}
              value={formData?.location?.address}
            />
            <PhoneInput
              onChangeText={(text) => handleInputChange("phone", text)}
              error={errors.phone}
              value={formData?.phone}
            />
            <PasswordField
              label="Password"
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              showPassword={showPassword}
              toggleShow={() => setShowPassword(!showPassword)}
              error={errors.password}
            />

            {/* Confirm Password */}
            <View>
              <Text className="font-poppins-400regular text-base text-[#000] mb-[2%]">
                Confirm Password
              </Text>
              <View className="flex-row items-center bg-[#F9F9F9] border border-[#DCDCDC] rounded-md px-[4%] py-[3%]">
                <Ionicons
                  // style={{ marginTop: verticalScale(10) }}
                  name="lock-closed-outline"
                  size={20}
                  color="#9CA3AF"
                />
                <TextInput
                  className="flex-1 font-poppins-400regular ml-[3%] text-sm bg-[#f9f9f9] text-black"
                  placeholder="Confirm password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                  value={formData?.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                  // style={{ paddingVertical: verticalScale(10) }}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-[2%]"
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="#9CA3AF"
                    style={{ paddingVertical: verticalScale(12) }}
                  />
                </Pressable>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-700 font-poppins text-center mt-1">
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View className="border-t border-[#dcdcdc]">
          <View className="flex-row pl-[5.5%] mt-[1%] items-center">
            <Pressable
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              activeOpacity={0.7}
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                borderWidth: 1.5,
                borderColor: agreeToTerms ? "#0054A5" : "#D1D5DB",
                backgroundColor: agreeToTerms ? "#0054A5" : "#fff",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              {agreeToTerms && (
                <Ionicons name="checkmark" size={13} color="#fff" />
              )}
            </Pressable>
            <AgreeWithTerms />
          </View>

          <View className="mb-[6%] px-[6%] mt-[2%] justify-center">
            <Pressable
              className="bg-[#0054A5] rounded-lg justify-center items-center py-[4%]"
              disabled={!agreeToTerms}
              style={{ opacity: agreeToTerms ? 1 : 0.6 }}
              onPress={handleSubmit}
            >
              <Text className="text-white text-center text-base font-poppins-semiBold">
                {isLoading ? "Signing In..." : "Sign Up"}
              </Text>
            </Pressable>

            <View className="mt-[3%] flex-row gap-[0.5%] justify-center">
              <Text className="font-poppins-400regular text-sm text-black">
                Already have an account?
              </Text>
              <Pressable onPress={() => router.push("/signIn")}>
                <Text className="font-poppins-semiBold underline text-sm text-[#0054A5]">
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
