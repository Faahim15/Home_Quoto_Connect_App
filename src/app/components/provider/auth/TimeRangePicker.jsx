import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatTime } from "../../../util/helper-function";
import { useDispatch, useSelector } from "react-redux";
import FormButton from "../../auth/FormButton";
import { router } from "expo-router";
import { setProviderRegister } from "../../../../redux/features/provider/providerSlice";
import Toast from "react-native-toast-message";
import * as Yup from "yup";
import { useRegisterUserMutation } from "../../../../redux/features/apiSlices/auth/authApiSlices";
import { resetProviderForm } from "../../../../redux/features/provider/providerSlice";
import Error from "../../shared/error/Error";
export default function TimeRangePicker() {
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [showPicker, setShowPicker] = useState({ type: null, show: false });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const registrationData = useSelector((state) => state.providerRegister);

  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const specializationIds = registrationData?.specializations.map(
    (spec) => spec.id
  );

  const workingHours = {
    from: registrationData?.from,
    to: registrationData?.to,
  };
  console.log(workingHours.from, workingHours.to);
  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      const updatedTime = selectedDate;

      if (showPicker.type === "from") {
        setFromTime(updatedTime);
        dispatch(
          setProviderRegister({
            field: "from", // ← Matches your Redux state
            value: formatTime(updatedTime),
          })
        );
      } else if (showPicker.type === "to") {
        setToTime(updatedTime);
        dispatch(
          setProviderRegister({
            field: "to", // ← Matches your Redux state
            value: formatTime(updatedTime),
          })
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

          // ✅ Helper function to convert "12:34 PM" to minutes
          const timeToMinutes = (timeStr) => {
            const [time, period] = timeStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);

            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            return hours * 60 + minutes;
          };

          const fromMinutes = timeToMinutes(from);
          const toMinutes = timeToMinutes(value);

          console.log("From minutes:", fromMinutes, "To minutes:", toMinutes);

          return toMinutes > fromMinutes;
        }
      )
      .test(
        "minimum-duration",
        "Availability must be at least 1 hour",
        function (value) {
          const { from } = this.parent;
          if (!from || !value) return true;

          // ✅ Same helper function
          const timeToMinutes = (timeStr) => {
            const [time, period] = timeStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);

            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            return hours * 60 + minutes;
          };

          const fromMinutes = timeToMinutes(from);
          const toMinutes = timeToMinutes(value);
          const diffMinutes = toMinutes - fromMinutes;
          const diffHours = diffMinutes / 60;

          return diffHours >= 1;
        }
      ),
  });

  const handleNext = async () => {
    try {
      // Step 1: Validate user input
      await currentPageSchema.validate(registrationData, { abortEarly: false });
      setErrors({});

      // Step 2: Prepare payload
      const formsData = new FormData();
      formsData.append("role", "provider");
      formsData.append("fullName", registrationData?.fullName);
      formsData.append("email", registrationData?.email);
      formsData.append("password", registrationData?.password);
      formsData.append("confirmPassword", registrationData?.confirmPassword);
      formsData.append("location", JSON.stringify(registrationData?.location));
      formsData.append("businessName", registrationData?.category);
      formsData.append("bio", registrationData?.bio);
      formsData.append(
        "experienceLevel",
        registrationData?.experience
          ?.split(" ")
          .slice(0, 1)
          .join("")
          .toLowerCase()
      );
      formsData.append("specializations", JSON.stringify(specializationIds));
      formsData.append(
        "serviceAreas",
        JSON.stringify(registrationData?.serviceArea?.split())
      );
      formsData.append("workingHours", JSON.stringify(workingHours));

      // 🚀 Send to backend
      const res = await registerUser(formsData).unwrap();
      dispatch(resetProviderForm());
      console.log("✅ provider Registration successfull:", res);
      // Step 4: Handle success
      if (res?.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: res?.message || "Registration successful!",
          visibilityTime: 2000,
        });
        router.push("provider/auth/signIn");
      } else {
        //  5: Handle logical failure (just in case)
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res?.message || "Registration failed",
          visibilityTime: 2000,
        });
      }
    } catch (err) {
      // Step 6: Handle validation or network errors
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
        // ✅ এখানে validation errors console এ print করুন
        console.log("🔴 Validation Errors:", validationErrors);
        console.log("📋 Full Error Details:", err.inner);
      } else {
        console.log("API Error:", err);
        const errorMessage =
          err?.data?.message ||
          err?.data?.email?.[0] ||
          err?.error ||
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
            <Text className="text-gray-500">{formatTime(fromTime)}</Text>
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
            <Text className="text-gray-500">{formatTime(toTime)}</Text>
          </TouchableOpacity>
          <Error error={errors?.to} />
        </View>

        {/* Time Picker */}
        {showPicker.show && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}
      </View>
      <View className=" flex-1 px-[2%]">
        <FormButton onPress={handleNext} title="Next" />
      </View>
    </>
  );
}
