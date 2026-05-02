import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import FormButton from "../../auth/FormButton";
import { router } from "expo-router";
import { setProviderRegister } from "../../../../redux/features/provider/providerSlice";
import Toast from "react-native-toast-message";
import * as Yup from "yup";
import { useRegisterUserMutation } from "../../../../redux/features/apiSlices/auth/authApiSlices";
import { resetProviderForm } from "../../../../redux/features/provider/providerSlice";
import Error from "../../shared/error/Error";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TimeRangePicker() {
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [showPicker, setShowPicker] = useState({ type: null, show: false });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const registrationData = useSelector((state) => state.providerRegister);

  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const specializationIds = registrationData?.specializations.map(
    (spec) => spec.id,
  );

  const convertTo24Hour = (date) => {
    if (!date) return "";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      const updatedTime = selectedDate;

      if (showPicker.type === "from") {
        setFromTime(updatedTime);
        dispatch(
          setProviderRegister({
            field: "from",
            value: convertTo24Hour(updatedTime),
          }),
        );
      } else if (showPicker.type === "to") {
        setToTime(updatedTime);
        dispatch(
          setProviderRegister({
            field: "to",
            value: convertTo24Hour(updatedTime),
          }),
        );
      }
    }
    setShowPicker({ type: null, show: false });
  };

  const currentPageSchema = Yup.object({
    from: Yup.string().required("Start time is required"),
    to: Yup.string()
      .required("End time is required")
      .test(
        "is-after-from",
        "End time must be after start time",
        function (value) {
          const { from } = this.parent;
          if (!from || !value) return true;

          const timeToMinutes = (timeStr) => {
            const [hours, minutes] = timeStr.split(":").map(Number);
            return hours * 60 + minutes;
          };

          const fromMinutes = timeToMinutes(from);
          const toMinutes = timeToMinutes(value);

          return toMinutes > fromMinutes;
        },
      )
      .test(
        "minimum-duration",
        "Availability must be at least 1 hour",
        function (value) {
          const { from } = this.parent;
          if (!from || !value) return true;

          const timeToMinutes = (timeStr) => {
            const [hours, minutes] = timeStr.split(":").map(Number);
            return hours * 60 + minutes;
          };

          const fromMinutes = timeToMinutes(from);
          const toMinutes = timeToMinutes(value);
          const diffMinutes = toMinutes - fromMinutes;
          const diffHours = diffMinutes / 60;

          return diffHours >= 1;
        },
      ),
  });

  const handleNext = async () => {
    try {
      await currentPageSchema.validate(registrationData, { abortEarly: false });
      setErrors({});

      const workingHours = {
        from: registrationData?.from,
        to: registrationData?.to,
      };

      const serviceAreas =
        registrationData?.serviceArea?.map((area) => area.name) || [];

      const payload = {
        role: "provider",
        fullName: registrationData?.fullName,
        email: registrationData?.email,
        password: registrationData?.password,
        confirmPassword: registrationData?.confirmPassword,
        location: registrationData?.location,
        businessName: registrationData?.category,
        bio: registrationData?.bio,
        experienceLevel: registrationData?.experience
          ?.split(" ")
          .slice(0, 1)
          .join("")
          .toLowerCase(),
        specializations: specializationIds,
        serviceAreas: serviceAreas,
        workingHours: workingHours,
        timezone: Intl.DateTimeFormat().resolvedOptions().timezone,
      };

      const res = await registerUser(payload).unwrap();
      dispatch(resetProviderForm());
      console.log("✅ provider Registration successful:", res);
      // ⭐ IMPORTANT: Save token to AsyncStorage immediately
      if (res?.data?.token) {
        await AsyncStorage.setItem("token", res.data.token);
      }

      if (res?.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: res?.message || "Registration successful!",
          visibilityTime: 2000,
        });
        router.replace({
          pathname: "/provider/auth/verifyOtp",
          params: { email: registrationData.email },
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res?.message || "Registration failed",
          visibilityTime: 2000,
        });
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        console.log("API Error:", err);
        const errorMessage =
          err?.message ||
          err?.data?.email?.[0] ||
          err?.data ||
          "Network or server error. Please try again.";

        Toast.show({
          type: "error",
          text1: "Error",
          text2: errorMessage,
          visibilityTime: 2000,
        });
      }
    }
  };

  return (
    <>
      <View className="items-center justify-center bg-white px-[2%]">
        {/* From */}
        <View className="w-[90%] mb-[4%]">
          <Text className="text-gray-700 font-poppins-500medium mb-[0.5%]">
            From
          </Text>
          <TouchableOpacity
            onPress={() => setShowPicker({ type: "from", show: true })}
            className="border border-gray-300 rounded-md px-[3%] py-[4%]"
          >
            <Text className="text-gray-500">
              {registrationData?.from || "Select time"}
            </Text>
          </TouchableOpacity>
          <Error error={errors?.from} />
        </View>

        {/* To */}
        <View className="w-[90%]">
          <Text className="text-gray-700 font-poppins-500medium mb-[0.5%]">
            To
          </Text>
          <TouchableOpacity
            onPress={() => setShowPicker({ type: "to", show: true })}
            className="border border-gray-300 rounded-md px-[3%] py-[4%]"
          >
            <Text className="text-gray-500">
              {registrationData?.to || "Select time"}
            </Text>
          </TouchableOpacity>
          <Error error={errors?.to} />
        </View>

        {/* Time Picker */}
        {showPicker.show && (
          <DateTimePicker
            value={
              showPicker.type === "from" && fromTime
                ? fromTime
                : showPicker.type === "to" && toTime
                  ? toTime
                  : new Date()
            }
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
            locale="en_GB" 
          />
        )}
      </View>
      <View className=" flex-1 px-[2%]">
        <FormButton onPress={handleNext} title="Next" isLoading={isLoading} />
      </View>
    </>
  );
}
