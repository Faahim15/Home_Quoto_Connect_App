import { useState } from "react";
import { Alert } from "react-native"; // Adjust the import path as needed
import { useDeleteJobMutation } from "../redux/features/apiSlices/user/createJobSlices";
import { router } from "expo-router";

export const useDeleteJob = () => {
  const [deleteJob, { isLoading }] = useDeleteJobMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showDeleteModal = () => setIsModalVisible(true);
  const hideDeleteModal = () => setIsModalVisible(false);

  const handleDelete = async (jobId) => {
    try {
      await deleteJob(jobId).unwrap();

      // Success - you might want to navigate back or show success message
      Alert.alert("Success", "Job deleted successfully");
      hideDeleteModal();

      router.back();
    } catch (error) {
      console.error("Failed to delete job:", error);
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to delete job. Please try again.",
      );
    }
  };

  return {
    isModalVisible,
    showDeleteModal,
    hideDeleteModal,
    handleDelete,
    isLoading,
  };
};
