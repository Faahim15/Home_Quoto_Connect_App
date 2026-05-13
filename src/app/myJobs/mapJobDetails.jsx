import { ScrollView, View } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import ProviderInfo from "../components/shared/services/JobDetails";
import XStyle from "../util/styles";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import BotttomButtons from "../components/shared/services/buttons/BottomButtons";
import { router, useLocalSearchParams } from "expo-router";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import { Text } from "react-native";
import UpdateQuoteButton from "../components/shared/services/buttons/UpdateQuoteButton";
import { useMyQuotes } from "../../hooks/useMyQuotes";
export default function MapJobDetails() {
  const { serviceId, showButtons } = useLocalSearchParams();

  const { data, isLoading } = useGetSingleJobQuery(serviceId);

  // const shouldShowbuttons = showButtons === "true";
  const service = data?.data?.job;
  const myQuotes = useMyQuotes(service?.quotes);

  const isAccepted = myQuotes?.some(
    (q) => q.status === "accepted" || q.status === "updated",
  );
  const acceptedQuote = myQuotes.find(
    (q) => q.status === "accepted" || q.status === "updated",
  );
  const quoteId = acceptedQuote?._id;

  const updatedOffer = isAccepted && service?.status === "in_progress";
  const shouldRenderUpdateButton =
    updatedOffer || service?.status === "pending";
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9]">
        <Text className="text-gray-500 text-base">
          Loading service details...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <CustomTitle title={service?.serviceCategory?.title} withSafeTop={true} />
      <View className="flex-1 mb-[2%]  px-[6%] bg-[#F9F9F9]">
        <ScrollView
          contentContainerStyle={{ paddingBottom: verticalScale(40) }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <ProviderInfo showPrice={showButtons} item={service} />
          </View>
        </ScrollView>
      </View>

      {shouldRenderUpdateButton && service?.status !== "expired" && (
        <UpdateQuoteButton
          serviceId={service?._id}
          quoteId={quoteId}
          title={updatedOffer ? "Send an updated offer" : "Send an offer"}
        />
      )}
    </View>
  );
}
