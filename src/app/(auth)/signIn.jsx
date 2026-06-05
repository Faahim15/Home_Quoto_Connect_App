import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import ArrowBack from "../components/auth/ArrowBack";
import EmailField from "../components/auth/EmailField";
import PasswordField from "../components/auth/PasswordField";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ShortMessage from "../components/auth/ShortMessage";
import { router } from "expo-router";
import { useLoginUserMutation } from "../../redux/features/apiSlices/auth/authApiSlices";
import { toast } from "sonner-native";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scale } from "../components/adaptive/Adaptiveness";
export default function SignInScreen() {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [login, { isLoading }] = useLoginUserMutation();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Re-validate just this field and clear its error if it passes
    try {
      await validationSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch {
      // Don't set new errors here — only clear on success
    }
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const data = {
        email: formData.email.trim(),
        password: formData.password,
        // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      const res = await login(data).unwrap();

      await AsyncStorage.setItem("token", res?.data?.token);
      await AsyncStorage.setItem("userId", res?.data?.user?._id);
      await AsyncStorage.setItem("role", res?.data?.user?.role);

      toast.success(`Welcome back, ${res?.data?.user?.fullName || "User"}!`);

      if (res?.data?.user?.role !== "provider") router.push("/home");
      else {
        toast.info("Please log in using your user credentials to continue.");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const fieldErrors = {};
        error.inner.forEach((err) => {
          fieldErrors[err.path] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        const status = error?.data?.status || error?.status;
        const errorMessage =
          error?.data?.message || error.message || "Something went wrong!";
        let errorTitle = "Sign In Failed";

        if (status === 401) {
          errorTitle = "Invalid Credentials";
        } else if (status === 403) {
          errorTitle = "Access Denied";
        } else if (status === 404) {
          errorTitle = "Not Found";
        } else if (status >= 500) {
          errorTitle = "Server Problem";
        } else if (!status && error.message === "Network Error") {
          errorTitle = "No Internet Connection";
        }

        toast.error(errorTitle, {
          description: errorMessage,
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-[#F9FAFB]">
          <ArrowBack />

          <View className="mt-[1.5%] justify-center items-center">
            <Text className="font-poppins-500medium text-2xl text-[#292929]">
              Welcome Back!
            </Text>
            <Text className="font-poppins-500medium text-2xl text-[#319FCA]">
              Let's Sign in
            </Text>
          </View>

          <View className="mx-[6%] mt-[10%]">
            <EmailField
              onChangeText={(text) => handleInputChange("email", text)}
              error={errors.email}
              label="Email"
              value={formData.email}
            />
            <PasswordField
              onChangeText={(text) => handleInputChange("password", text)}
              error={errors.password}
              value={formData.password}
            />
          </View>

          <View className="flex-row pl-[5.5%] pb-[6%] items-center">
            <Pressable
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              className="mr-[1%]"
            >
              <Ionicons
                name={agreeToTerms ? "checkbox" : "square-outline"}
                size={16}
                color={agreeToTerms ? "#909090" : "#9CA3AF"}
              />
            </Pressable>
            <View className="w-[88%] items-center flex-row justify-between">
              <Text className="text-sm  font-poppins-400regular text-[#000000]">
                Remember me
              </Text>
              <Pressable onPress={() => router.push("/forgetPassword")}>
                <Text className="text-base  font-poppins-bold text-[#175994] underline">
                  Forget Password?
                </Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            className="bg-[#0054A5] mx-[6%] rounded-lg py-[4%]"
            onPress={handleSubmit}
            disabled={isLoading} // Disable button while loading
          >
            <View className="flex-row items-center justify-center">
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={{ marginRight: scale(8) }}
                />
              )}
              <Text className="text-white text-center text-base font-poppins-semiBold">
                {isLoading ? "Processing..." : "Sign In"}
              </Text>
            </View>
          </Pressable>

          <ShortMessage
            title="Don't you have an account?"
            btnText="Sign Up"
            onPress={() => router.push("/signUp")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
