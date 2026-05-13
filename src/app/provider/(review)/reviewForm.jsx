import { View, Text, ActivityIndicator } from "react-native";
import CustomTitle from "../../components/shared/CustomTitle";
import RatingDropdown from "../../components/shared/review/RatingDropdown";
import WriteBox from "../../components/shared/review/WriteBox";
import CustomButton from "../../components/tabs/home/services/provider/details/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import { useGetSingleJobQuery } from "../../../redux/features/apiSlices/user/createJobSlices";
import { useState } from "react";
import { toast } from "sonner-native";
import { useCreateReviewMutation } from "../../../redux/features/apiSlices/review/reviewApiSlice";

export default function ReviewFormScreen() {
  const { jobId, reviewType } = useLocalSearchParams();
  const { data, isLoading, error } = useGetSingleJobQuery(jobId);

  const findReviewType = reviewType === "client-to-provider";

  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

  const [formData, setFormData] = useState({
    rating: null,
    comment: "",
  });

  const { fullName } = data?.data?.job?.client || {};

  const providerName = data?.data?.job?.quotes[0]?.provider;

  // ⭐ handle submit
  const handleSubmit = async () => {
    if (!formData.rating) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please write a comment before submitting.");
      return;
    }

    try {
      await createReview({
        jobId,
        rating: Number(formData.rating),
        comment: formData.comment,
        reviewType: findReviewType
          ? "client_to_provider"
          : "provider_to_client",
      }).unwrap();

      toast.success("Your review has been submitted!");

      // Wait before navigation
      setTimeout(() => {
        if (findReviewType) {
          router.replace("/myJobs");
        } else {
          router.replace("provider/myJobs");
        }
      }, 1500);
    } catch (err) {
      toast.error(err?.message || "Failed to submit review. Try again.");
      console.log("Review submit error:", err?.message);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f9f9f9]">
        <ActivityIndicator size="large" color="#5C5F62" />
        <Text className="mt-3 font-poppins-500medium text-base text-[#5C5F62]">
          Loading your job details...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f9f9f9]">
        <Text className="font-poppins-500medium text-base text-red-500">
          Something went wrong. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="px-[5%]">
        <CustomTitle title="Review" />
      </View>

      <View className="mt-[3%] px-[5%]">
        <Text className="font-poppins-500medium text-base text-[#5C5F62]">
          How was your experience with{" "}
          <Text className="text-black">
            {findReviewType ? providerName?.fullName : fullName}?
          </Text>
        </Text>
      </View>

      <RatingDropdown
        selected={formData.rating}
        onSelect={(rating) => setFormData({ ...formData, rating })}
      />

      <WriteBox
        value={formData.comment}
        onChangeText={(text) => setFormData({ ...formData, comment: text })}
      />

      <View className="flex-1 justify-end pb-[25%] px-[5%]">
        <CustomButton
          title={isSubmitting ? "Submitting..." : "Done"}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}
