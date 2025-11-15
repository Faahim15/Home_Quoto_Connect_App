import { ScrollView, View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import CustomTitle from "../components/shared/services/CustomTitle";
import ProviderInfo from "../components/shared/services/JobDetails";
import UpdateQuoteButton from "../components/shared/services/buttons/UpdateQuoteButton";
import { verticalScale } from "../components/adaptive/Adaptiveness";
import { useMyQuotes } from "../../hooks/useMyQuotes";

export default function ServiceDetails() {
  const { serviceId, showButtons, showPrice } = useLocalSearchParams();
  const { data, isLoading, error } = useGetSingleJobQuery(serviceId);
  const service = data?.data?.job;
  const myQuotes = useMyQuotes(service?.quotes);

  console.log("show qutoes", myQuotes);

  const shouldShowButtons = showButtons === "true";
  const shouldShowPrice = showPrice === "true";
  const isAccepted = myQuotes?.some((q) => q.status === "accepted");
  const isServiceInactive = ["in_progress", "expired"].includes(
    service?.status
  );

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
          We couldn't locate the service details. Please check the link or try
          again later.
        </Text>
      </View>
    );
  }

  const shouldRenderUpdateButton =
    shouldShowButtons &&
    (!isAccepted || service?.status === "in_progress") &&
    !isServiceInactive;

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="flex-1 mb-[2%] px-[6%] bg-[#F9F9F9]">
        <CustomTitle
          title={service?.serviceCategory?.title || "Service Details"}
        />
        <ScrollView
          contentContainerStyle={{ paddingBottom: verticalScale(40) }}
          showsVerticalScrollIndicator={false}
        >
          <ProviderInfo showPrice={shouldShowPrice} item={service} />
        </ScrollView>
      </View>

      {shouldRenderUpdateButton && (
        <UpdateQuoteButton
          title={
            service?.status === "in_progress"
              ? "Send an updated offer"
              : "Send an offer"
          }
        />
      )}
    </View>
  );
}
