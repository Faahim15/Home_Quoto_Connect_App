import { ScrollView, View } from "react-native";
import CustomTitle from "../components/shared/services/CustomTitle";
import { verticalScale } from "../components/adaptive/Adaptiveness";
import CustomButton from "../components/shared/services/buttons/ServiceButton";
import { router, useLocalSearchParams } from "expo-router";
import JobInfo from "../components/tabs/myJobs/JobInfo";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import { Text } from "react-native";
export default function ServiceDetails() {
  const { serviceId } = useLocalSearchParams();
  const { data, isLoading, error } = useGetSingleJobQuery(serviceId);
  const service = data?.data?.job;
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9]">
        <Text className="text-gray-500 text-base">
          Loading service details...
        </Text>
      </View>
    );
  }

  if (error || !service) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9] px-[6%]">
        <CustomTitle title="Service not found" />
        <Text className="text-gray-500 text-base mt-[2%]">
          We couldn’t locate the service details. Please check the link or try
          again later.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="flex-1 mb-[2%]  px-[6%] bg-[#F9F9F9]">
        <CustomTitle
          title={service?.serviceCategory?.title || "Service Details"}
        />
        <ScrollView
          contentContainerStyle={{ paddingBottom: verticalScale(40) }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <JobInfo item={service} />
          </View>
          {/* {showCompleteJob && (
            <View className="mt-[8%] ">
              <ActionButton route="ReviewFormScreen" title="Complete Job" />
            </View>
          )} */}
        </ScrollView>
      </View>

      <View className="px-[6%] pb-[18%]">
        <CustomButton
          onPress={() => router.push("/jobs/jobForm")}
          title="Edit Job"
        />
      </View>
    </View>
  );
}
