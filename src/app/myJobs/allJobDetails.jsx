import { ScrollView, View, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import CustomTitle from "../components/shared/services/CustomTitle";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import CustomButton from "../components/shared/services/buttons/ServiceButton";
import { router, useLocalSearchParams } from "expo-router";
import JobInfo from "../components/tabs/myJobs/JobInfo";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import { Text } from "react-native";
import DeleteConfirmationModal from "../components/tabs/myJobs/modal/DeleteConfirmationModal";
import { useDeleteJob } from "../../hooks/useDeleteJob";

export default function ServiceDetails() {
  const { serviceId } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useGetSingleJobQuery(serviceId);
  const service = data?.data?.job;

  const {
    isModalVisible,
    showDeleteModal,
    hideDeleteModal,
    handleDelete,
    isLoading: isDeleting,
  } = useDeleteJob();

 
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9]">
        <ActivityIndicator size="large" color="#0066CC" />
        <Text className="text-gray-500 text-base mt-[2%]">
          Loading job details...
        </Text>
      </View>
    );
  }

  if (error || !service) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9] px-[6%]">
        <CustomTitle title="Service not found" />
        <Text className="text-gray-500 text-base mt-[2%]">
          We couldn't locate the service details. Please check the link or try
          again later.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="flex-1 mb-[2%] px-[6%] bg-[#F9F9F9]">
        <ScrollView
          contentContainerStyle={{ paddingBottom: verticalScale(40) }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <JobInfo item={service} />
          </View>
        </ScrollView>
      </View>

      <View className="px-[6%] pb-[18%] space-y-3">
        {service?.status === "pending" && (
          <View className="flex-row justify-center items-center gap-x-4">
            <CustomButton
              onPress={() =>
                router.push({
                  pathname: "/jobs/uploadPhotos",
                  params: { jobId: service?._id },
                })
              }
              title="Edit Job"
              width={scale(148)}
            />
            {/* Delete Button */}
            <CustomButton
              onPress={showDeleteModal}
              title="Delete Job"
              bg="#ef4444"
              border="#ef4444"
              width={scale(148)}
            />
          </View>
        )}
      </View>

    
      <DeleteConfirmationModal
        visible={isModalVisible}
        onClose={hideDeleteModal}
        onConfirm={() => handleDelete(serviceId)}
        isLoading={isDeleting}
      />
    </View>
  );
}
