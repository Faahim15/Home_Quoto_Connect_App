import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import CustomTitle from "../components/shared/services/CustomTitle";
import ProviderInfo from "../components/shared/services/JobDetails";
import UpdateQuoteButton from "../components/shared/services/buttons/UpdateQuoteButton";
import { verticalScale } from "../components/adaptive/Adaptiveness";
import { useMyQuotes } from "../../hooks/useMyQuotes";
import { useState, useCallback } from "react";

export default function ServiceDetails() {
  const { serviceId, showButtons, showPrice } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useGetSingleJobQuery(serviceId);
  const service = data?.data?.job;
  const myQuotes = useMyQuotes(service?.quotes);
  const [refreshing, setRefreshing] = useState(false);

  console.log("job id", serviceId);

  const shouldShowButtons = showButtons === "true";
  const shouldShowPrice = showPrice === "true";
  const isAccepted = myQuotes?.some(
    (q) => q.status === "accepted" || q.status === "updated"
  );
  const acceptedQuote = myQuotes.find(
    (q) => q.status === "accepted" || q.status === "updated"
  );

  const quoteId = acceptedQuote?._id;

  // Auto-refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F9F9]">
        <ActivityIndicator size="large" color="#0066CC" />
        <Text className="text-gray-500 text-base mt-[2%]">
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

  const updatedOffer = isAccepted && service?.status === "in_progress";
  const shouldRenderUpdateButton =
    shouldShowButtons && (updatedOffer || service?.status === "pending");

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="flex-1 mb-[2%] px-[6%] bg-[#F9F9F9]">
        <CustomTitle
          title={service?.serviceCategory?.title || "Service Details"}
        />
        <ScrollView
          contentContainerStyle={{ paddingBottom: verticalScale(40) }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007AFF"]} // Android
              tintColor="#007AFF" // iOS
              progressBackgroundColor="#FFFFFF" // Android
            />
          }
        >
          <ProviderInfo showPrice={shouldShowPrice} item={service} />
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
