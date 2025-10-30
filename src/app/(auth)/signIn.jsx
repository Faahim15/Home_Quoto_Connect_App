import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ArrowBack from "../components/auth/ArrowBack";
import EmailField from "../components/auth/EmailField";
import PasswordField from "../components/auth/PasswordField";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ShortMessage from "../components/auth/ShortMessage";
import { router } from "expo-router";
import { useLoginUserMutation } from "../../redux/features/apiSlices/auth/authApiSlices";
import Toast from "react-native-toast-message";
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
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),

    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleSubmit = async () => {
    try {
      // ✅ Validate form data
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      // ✅ Prepare login payload
      const data = {
        email: formData.email,
        password: formData.password,
      };

      // ✅ Send login request
      const res = await login(data).unwrap();

      // ✅ Store the token
      await AsyncStorage.setItem("token", res?.data?.token);
      // check if saved
      const token = await AsyncStorage.getItem("token");
      console.log("see token", token);
      // ✅ Show success toast
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${res?.user?.fullName || "User"}!`,
      });

      console.log("Login response:", res);

      // ✅ Navigate to /home
      router.push("/home");
    } catch (error) {
      // ❌ Show error toast
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error?.message || "Something went wrong. Please try again.",
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
            />
            <PasswordField
              onChangeText={(text) => handleInputChange("password", text)}
              error={errors.password}
            />
          </View>

          <View className="flex-row pl-[5.5%] pb-[6%] items-center">
            <TouchableOpacity
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              className="mr-[3%]"
            >
              <Ionicons
                name={agreeToTerms ? "checkbox" : "square-outline"}
                size={16}
                color={agreeToTerms ? "#909090" : "#9CA3AF"}
              />
            </TouchableOpacity>
            <View className="w-[85%] flex-row justify-between">
              <Text className="text-sm pt-[1%] font-poppins-400regular text-[#000000]">
                Remember me
              </Text>
              <TouchableOpacity onPress={() => router.push("/forgetPassword")}>
                <Text className="text-base font-poppins-bold text-[#175994] underline">
                  Forget Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
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
          </TouchableOpacity>

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
