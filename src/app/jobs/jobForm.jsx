import React from "react";
import { View, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";

// Components
import CustomTitle from "../components/shared/CustomTitle";
import TextField from "../components/tabs/jobs/TextField";
import ServiceSearch from "../components/tabs/jobs/ServiceSearch";
import TimePicker from "../components/tabs/home/services/provider/TimePicker";
import ButtonGroup from "../components/tabs/home/services/provider/ButtonGroup";
import PriceSlider from "../components/tabs/home/PriceInput";
import RequestButton from "../components/tabs/home/services/provider/RequestButton";
import InstructionField from "../components/tabs/home/services/provider/InstructionField";
import Specializations from "../components/tabs/home/Specializations";
import LocationPicker from "../components/auth/LocationPicker";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import { verticalScale } from "../components/adaptive/Adaptiveness";
import { useCreateJobMutation } from "../../redux/features/apiSlices/user/createJobSlices";
// Redux
import { setJobField } from "../../redux/features/jobPost/jobPostSlice";

export default function JobFormScreen() {
  const dispatch = useDispatch();
  const jobData = useSelector((state) => state.jobPost);
  const [createJob, { isLoading }] = useCreateJobMutation();
  // const photos = useSelector((state) => state.jobPost.photos);
  console.log("JobForm", jobData);
  // 🔄 Common handler for all input changes
  const handleInputChange = (field, value) => {
    dispatch(setJobField({ field, value }));
  };

  // ✅ Continue to next screen
  const handleContinue = async () => {
    if (!jobData.title || !jobData.location) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();

      // 🧾 Append all simple fields
      formData.append("title", jobData.title);
      formData.append("description", jobData.specificInstructions);
      formData.append("serviceCategory", jobData.serviceCategory);
      formData.append(
        "specializations",
        JSON.stringify(jobData.specializations)
      );
      formData.append(
        "location",
        JSON.stringify({
          type: "Point",
          coordinates: jobData.location.coordinates,
          address: jobData.location.address,
        })
      );
      formData.append("urgency", jobData.urgency);
      formData.append("preferredDate", jobData.preferredDate);
      formData.append("preferredTime", jobData.preferredTime);
      formData.append(
        "priceRange",
        JSON.stringify({
          from: jobData.priceRange.from,
          to: jobData.priceRange.to,
          isPersonalized: jobData.priceRange.isPersonalized,
        })
      );
      formData.append("specificInstructions", jobData.specificInstructions);
      // 🖼️ Append photos (if any)
      if (jobData.photos && jobData.photos.length > 0) {
        jobData.photos.forEach((photo, index) => {
          formData.append("photos", {
            uri: photo.uri,
            type: photo.type || "image/jpeg",
            name: photo.name || `photo_${index}.jpg`,
          });
        });
      }

      // 🚀 Send to backend
      const response = await createJob(formData).unwrap();

      console.log("✅ Job posted successfully:", response);

      alert("Job created successfully!");
      router.push("/jobs/jobSummary");
    } catch (error) {
      console.error("❌ Job creation failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <View className="bg-[#f9f9f9] flex-1">
      {/* Header */}
      <View className="px-[6%]">
        <CustomTitle title="Post a Job" />
      </View>

      {/* Scrollable form */}
      <FlatList
        data={[]} // Dummy data to enable scroll
        keyExtractor={(_, index) => index.toString()}
        renderItem={null}
        contentContainerStyle={{ paddingBottom: verticalScale(70) }}
        ListHeaderComponent={
          <View className="pb-[10%]">
            {/* 🧾 Job Title */}
            <View className="px-[6%] mt-[3%]">
              <TextField
                label="Job Title"
                value={jobData.title}
                onChangeText={(value) => handleInputChange("title", value)}
              />
            </View>

            {/* 🧰 Service Search */}
            <ServiceSearch onSelectService={handleInputChange} />

            {/* 📍 Location */}
            <View className="px-[6%]">
              <LocationPicker
                onLocationSelect={(loc) => handleInputChange("location", loc)}
                // error={errors.location}
              />
            </View>

            {/* 🕒 Time Picker */}
            <View className="px-[6%]">
              <TimePicker />
            </View>

            {/* ⚙️ Job Type / Options */}
            <View className="px-[6%]">
              <ButtonGroup
                selectedOption={jobData.jobType}
                handleInputChange={handleInputChange}
              />
            </View>

            {/* 💰 Price and Request */}
            <View className="px-[6%] mt-[3%]">
              <PriceSlider
                value={jobData.price}
                onChange={(value) => handleInputChange("price", value)}
              />
              <RequestButton
                urgent={jobData.isUrgent}
                onToggleUrgent={(value) => handleInputChange("isUrgent", value)}
              />
            </View>

            {/* 📝 Instructions */}
            <View className="mt-[3%] px-[6%]">
              <InstructionField
                // value={jobData.instructions}
                onChangeText={(value) =>
                  handleInputChange("specificInstructions", value)
                }
              />
            </View>

            {/* 🧠 Specializations */}
            <View className="px-[6%]">
              <Specializations
                // selected={jobData.specializations}
                onChange={handleInputChange}
              />
            </View>

            {/* 🚀 Continue Button */}
            <View className="px-[6%] mt-[5%]">
              <CustomButton title="Continue" onPress={handleContinue} />
            </View>
          </View>
        }
      />
    </View>
  );
}
