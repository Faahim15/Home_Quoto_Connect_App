import { Text, View } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  useCreateJobMutation,
  useUpdateJobMutation,
} from "../../redux/features/apiSlices/user/createJobSlices";
import { toast } from "sonner-native";
import { resetJobPost } from "../../redux/features/jobPost/jobPostSlice";
import ReviewPost from "../components/tabs/jobs/ReviewPost";

export default function JobSummaryScreen() {
  const jobData = useSelector((state) => state.jobPost);
  const { jobId } = useLocalSearchParams();
  const [createJob, { isLoading: createLoading }] = useCreateJobMutation();
  const [updateJob, { isLoading: updateLoading }] = useUpdateJobMutation();
  const [longitude, latitude] = jobData.location.coordinates;
  const specializationIds = jobData?.specializations.map((spec) => spec.id);

  const dispatch = useDispatch();

  const isLoading = createLoading || updateLoading;

  const prepareFormData = () => {
    const formData = new FormData();

    formData.append("title", jobData.title);
    formData.append("description", jobData.specificInstructions);
    formData.append("serviceCategory", jobData?.serviceCategory?.id);

    formData.append("specializations", JSON.stringify(specializationIds));

    formData.append("location[type]", "Point");
    formData.append("location[coordinates][0]", longitude);
    formData.append("location[coordinates][1]", latitude);
    formData.append("location[details][houseNumber]", jobData.houseNumber);
    formData.append("location[details][streetNumber]", jobData.streetNumber);
    formData.append(
      "location[details][completeAddress]",
      jobData.completeAddress,
    );
    formData.append("location[details][city]", jobData.location.city);
    formData.append("location[details][state]", jobData.location.state);
    formData.append("location[details][country]", jobData.location.country);
    formData.append(
      "location[details][zipCode]",
      jobData?.location?.zipCode || "N/A",
    );
    formData.append("location[address]", jobData.location.address);

    formData.append("urgency", jobData.urgency);
    formData.append("preferredDate", jobData.preferredDate);
    formData.append("preferredTime", jobData.preferredTime);
    formData.append("specificInstructions", jobData.specificInstructions);

    if (jobData.photos && jobData.photos.length > 0) {
      jobData.photos.forEach((photo, index) => {
        if (photo.uri) {
          formData.append("photos", {
            uri: photo.uri,
            type: photo.type || "image/jpeg",
            name: photo.name || `photo_${index}.jpg`,
          });
        }
      });
    }

    formData.append("priceRange[from]", jobData.priceRange.from);
    formData.append("priceRange[to]", jobData.priceRange.to);
    formData.append(
      "priceRange[isPersonalized]",
      jobData.priceRange.isPersonalized,
    );

    return formData;
  };

  const handleCreateJob = async () => {
    try {
      const formData = prepareFormData();

      const response = await createJob(formData).unwrap();
      dispatch(resetJobPost());
      console.log("✅ Job posted successfully:", response);

      toast.success("Job created successfully!");

      router.replace("/home");
    } catch (error) {
      console.error("❌ Job creation failed:", error);
      toast.error(
        error?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  const handleUpdateJob = async () => {
    try {
      const formData = prepareFormData();

      const response = await updateJob({
        jobId,
        formData,
      }).unwrap();

      dispatch(resetJobPost());

      // Show success toast
      toast.success("Job updated successfully!");

      router.replace("/myJobs");
    } catch (error) {
      console.error("❌ Job update failed:", error);
      toast.error(error?.message || "Failed to update job. Please try again.");
    }
  };

  const handlePostJob = () => {
    if (jobId) {
      handleUpdateJob();
    } else {
      handleCreateJob();
    }
  };

  const getButtonTitle = () => {
    if (isLoading) {
      return jobId ? "Updating Job..." : "Posting Job...";
    }
    return jobId ? "Update Job" : "Post your job";
  };

  return (
    <View className="flex-1 px-[6%] mt-[3%] bg-[#F9F9F9]">
      <View>
        <Text className="font-poppins-500medium text-base ">
          {jobId ? "Review Updates" : "Review Summary"}
        </Text>
        <ReviewPost isLoading={isLoading} jobData={jobData} />
      </View>
      <View>
        <CustomButton
          isLoading={isLoading}
          title={getButtonTitle()}
          onPress={handlePostJob}
        />
      </View>
    </View>
  );
}
