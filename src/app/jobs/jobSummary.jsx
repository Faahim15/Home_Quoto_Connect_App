import { Text, View } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import JobSummary from "../components/tabs/jobs/JobSummary";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { useCreateJobMutation } from "../../redux/features/apiSlices/user/createJobSlices";
import Toast from "react-native-toast-message";
import { resetJobPost } from "../../redux/features/jobPost/jobPostSlice";
import ReviewPost from "../components/tabs/jobs/ReviewPost";

export default function JobSummaryScreen() {
  const jobData = useSelector((state) => state.jobPost);
  console.log("preferredDate", jobData.preferredDate);
  const [createJob, { isLoading }] = useCreateJobMutation();
  const [longitude, latitude] = jobData.location.coordinates;
  const dispatch = useDispatch();
  const handlePostJob = async () => {
    try {
      const formData = new FormData();

      // 🧾 Append all simple fields
      formData.append("title", jobData.title);
      formData.append("description", jobData.specificInstructions);
      formData.append("serviceCategory", jobData.serviceCategory);

      // specializations
      formData.append(
        "specializations",
        `["${jobData.specializations.join('","')}"]`
      );

      // post location
      formData.append("location[type]", "Point");
      formData.append("location[coordinates][0]", longitude);
      formData.append("location[coordinates][1]", latitude);
      formData.append("location[details][houseNumber]", jobData.houseNumber);
      formData.append("location[details][streetNumber]", jobData.streetNumber);
      formData.append(
        "location[details][completeAddress]",
        jobData.completeAddress
      );
      formData.append("location[details][city]", jobData.location.city);
      formData.append("location[details][state]", jobData.location.state);
      formData.append("location[details][country]", jobData.location.country);
      formData.append(
        "location[details][zipCode]",
        jobData?.location?.zipCode || "N/A"
      );
      formData.append("location[address]", jobData.location.address);

      // posting date and time
      formData.append("urgency", jobData.urgency);
      formData.append("preferredDate", jobData.preferredDate);
      formData.append("preferredTime", jobData.preferredTime);
      formData.append("specificInstructions", jobData.specificInstructions);

      // posting photos
      if (jobData.photos && jobData.photos.length > 0) {
        jobData.photos.forEach((photo, index) => {
          formData.append("photos", {
            uri: photo.uri,
            type: photo.type || "image/jpeg",
            name: photo.name || `photo_${index}.jpg`,
          });
        });
      }

      // posting price Range
      formData.append("priceRange[from]", jobData.priceRange.from);
      formData.append("priceRange[to]", jobData.priceRange.to);
      formData.append(
        "priceRange[isPersonalized]",
        jobData.priceRange.isPersonalized
      );

      // 🚀 Send to backend
      const response = await createJob(formData).unwrap();
      dispatch(resetJobPost());
      console.log("✅ Job posted successfully:", response);

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Job created successfully!",
        position: "top",
      });

      // Go to home page
      router.replace("/home");
    } catch (error) {
      console.error("❌ Job creation failed:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong. Please try again.",
        position: "bottom",
      });
    }
  };

  return (
    <View className="flex-1 px-[6%] bg-[#F9F9F9]">
      <View>
        <CustomTitle title="Post a Job" />
      </View>
      <View>
        <Text className="font-poppins-500medium text-base ">
          Review Summary
        </Text>
        <ReviewPost isLoading={isLoading} jobData={jobData} />
      </View>
      <View>
        <CustomButton
          isLoading={isLoading}
          title="Post your job"
          onPress={handlePostJob}
        />
      </View>
    </View>
  );
}
