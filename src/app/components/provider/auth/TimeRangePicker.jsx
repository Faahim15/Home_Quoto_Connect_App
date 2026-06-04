import React, { useState } from "react";
import { View, Text, Platform, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import FormButton from "../../auth/FormButton";
import { router } from "expo-router";
import { setProviderRegister } from "../../../../redux/features/provider/providerSlice";
import { toast } from "sonner-native";
import * as Yup from "yup";
import { useRegisterProviderMutation } from "../../../../redux/features/apiSlices/auth/authApiSlices";
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

  const [registerUser, { isLoading }] = useRegisterProviderMutation();
  const specializationIds = registrationData?.specializations.map(
    (spec) => spec.id,
  );
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
    to: Yup.string().required("End time is required"),
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
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      const res = await registerUser(payload).unwrap();

      if (res?.data?.token) {
        await AsyncStorage.setItem("token", res.data.token);
      }

      if (res?.success) {
        dispatch(resetProviderForm());
        toast.success(res?.message || "Registration successful!");
        router.dismissAll();
        router.replace({
          pathname: "/provider/auth/verifyOtp",
          params: { email: registrationData.email },
        });
      } else {
        toast.error(res?.message || "Registration failed");
      }
    } catch (err) {
      console.log("FULL ERROR:", JSON.stringify(err, null, 2));
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        toast.error(
          err?.data?.message ||
            err?.message ||
            "Network or server error. Please try again.",
        );
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
          <Pressable
            onPress={() => setShowPicker({ type: "from", show: true })}
            className="border border-gray-300 rounded-md px-[3%] py-[4%]"
          >
            <Text className="text-gray-500">
              {registrationData?.from || "Select time"}
            </Text>
          </Pressable>
          <Error error={errors?.from} />
        </View>

        {/* To */}
        <View className="w-[90%]">
          <Text className="text-gray-700 font-poppins-500medium mb-[0.5%]">
            To
          </Text>
          <Pressable
            onPress={() => setShowPicker({ type: "to", show: true })}
            className="border border-gray-300 rounded-md px-[3%] py-[4%]"
          >
            <Text className="text-gray-500">
              {registrationData?.to || "Select time"}
            </Text>
          </Pressable>
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
