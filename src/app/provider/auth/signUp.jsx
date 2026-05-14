import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
import TextField from "../../components/auth/TextField";
import EmailField from "../../components/auth/EmailField";
import PasswordField from "../../components/auth/PasswordField";
import ArrowBack from "../../components/auth/ArrowBack";
import LocationPicker from "../../components/auth/LocationPicker";
import { router } from "expo-router";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setProviderRegister } from "../../../redux/features/provider/providerSlice";
import PhoneInput from "../../components/auth/PhoneNumber";
import AgreeWithTerms from "../../components/auth/AgreeWithTerms";
export default function SignUp() {
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const registrationData = useSelector((state) => state.providerRegister);

  const handleInputChange = (field, value) => {
    dispatch(setProviderRegister({ field, value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateCurrentPage = () => {
    const currentPageSchema = Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      location: Yup.object()
        .nullable()
        .required("Location is required")
        .test(
          "has-coordinates",
          "Location coordinates are required",
          (value) => {
            return value?.coordinates && value.coordinates.length === 2;
          },
        ),
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
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    });

    const transformedData = {
      ...registrationData,
    };

    try {
      currentPageSchema.validateSync(transformedData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleContinue = () => {
    if (validateCurrentPage()) {
      router.replace("provider/auth/serviceForm");
    } else console.log("errors", errors);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : verticalScale(20)}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="h-auto"
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
              onChangeText={(text) => handleInputChange("fullName", text)}
              error={errors.fullName}
              value={registrationData.fullName}
            />
            <EmailField
              onChangeText={(text) => handleInputChange("email", text)}
              error={errors.email}
              label="Email"
              value={registrationData.email}
            />
            <PhoneInput
              onChangeText={(text) => handleInputChange("phone", text)}
              error={errors.phone}
              value={registrationData.phone}
            />
            <LocationPicker
              onLocationSelect={(loc) => handleInputChange("location", loc)}
              error={errors.location}
              value={registrationData.location.address}
            />

            <PasswordField
              onChangeText={(text) => handleInputChange("password", text)}
              error={errors.password}
              value={registrationData.password}
              textContentType="newPassword"
              autoComplete="new-password"
            />

            {/* Confirm Password */}
            <View>
              <Text className="font-poppins-400regular text-base text-[#000] mb-[2%]">
                Confirm Password
              </Text>
              <View className="flex-row  bg-[#F9F9F9] border border-[#DCDCDC] rounded-md px-[4%] py-[3%]">
                <Ionicons
                  style={{ paddingVertical: verticalScale(10) }}
                  name="lock-closed-outline"
                  size={20}
                  color="#9CA3AF"
                />
                <TextInput
                  className="flex-1 font-poppins-400regular ml-[3%] text-sm bg-[#f9f9f9] text-black"
                  placeholder="Confirm password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                  value={registrationData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                  style={{ paddingVertical: verticalScale(12) }}
                  textContentType="newPassword"
                  autoComplete="new-password"
                  autoCorrect={false}
                  autoCapitalize="none"
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
                    style={{ paddingTop: verticalScale(12) }}
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
        <View className="border-t border-[#dcdcdc]">
          {/* Terms and Conditions */}
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
          {/* Bottom Section */}
          <View className="mb-[4%] px-[6%] mt-[2%]  justify-center">
            <Pressable
              className="rounded-lg justify-center items-center py-[4%]"
              style={{ backgroundColor: agreeToTerms ? "#0054A5" : "#A0AEC0" }}
              onPress={() => {
                if (!agreeToTerms) return;
                handleContinue();
              }}
            >
              <Text className="text-white text-center text-base font-poppins-semiBold">
                Sign up
              </Text>
            </Pressable>

            <View className="mt-[3%] flex-row gap-[0.5%] justify-center">
              <Text className="font-poppins-400regular text-sm text-black">
                Already have an account?
              </Text>
              <Pressable
                onPress={() => {
                  router.push("provider/auth/signIn");
                }}
              >
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
