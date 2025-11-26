import { ScrollView, View } from "react-native";
import CustomTitle from "../components/shared/services/CustomTitle";
import ProviderInfo from "../components/shared/services/JobDetails";
import XStyle from "../util/styles";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import BotttomButtons from "../components/shared/services/buttons/BottomButtons";
import { router, useLocalSearchParams } from "expo-router";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import { Text } from "react-native";
export default function MapJobDetails() {
  const { serviceId, showButtons } = useLocalSearchParams();

  const { data, isLoading, error } = useGetSingleJobQuery(serviceId);

  const shouldShowbutton = showButtons === "true";

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9]">
        <Text className="text-gray-500 text-base">
          Loading service details...
        </Text>
      </View>
    );
  }

  const service = data?.data?.job;

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="flex-1 mb-[2%]  px-[6%] bg-[#F9F9F9]">
        <CustomTitle title={service?.serviceCategory?.title} />
        <ScrollView
          contentContainerStyle={{ paddingBottom: verticalScale(40) }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <ProviderInfo showPrice={showButtons} item={service} />
          </View>
        </ScrollView>
      </View>
      {shouldShowbutton && (
        <View
          className="flex-row gap-[6%] h-[14%]  border border-[#D8DCE0] justify-center items-center "
          style={[
            XStyle.shadowBox,
            { borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20) },
          ]}
        >
          <BotttomButtons
            onPress={() => router.replace("/myJobs")}
            backgroundColor="#fff"
            color="#EF4444"
            borderColor="#EF4444"
            title="Decline"
          />
          <BotttomButtons
            onPress={() => router.replace("/myJobs")}
            backgroundColor="#18649F"
            color="#fff"
            borderColor="#18649F"
            title="Accept"
          />
        </View>
      )}
    </View>
  );
}
