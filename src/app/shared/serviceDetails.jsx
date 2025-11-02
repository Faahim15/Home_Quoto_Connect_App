import { ScrollView, View, Text } from "react-native";
import CustomTitle from "../components/shared/services/CustomTitle";
import ProviderInfo from "../components/shared/services/JobDetails";
import XStyle from "../util/styles";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import BotttomButtons from "../components/shared/services/buttons/BottomButtons";
import CustomButton from "../components/shared/services/buttons/ServiceButton";
import { router, useLocalSearchParams } from "expo-router";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";

export default function ServiceDetails() {
  const { serviceId, showButtons, showPrice } = useLocalSearchParams();

  const { data, isLoading, error } = useGetSingleJobQuery(serviceId);
  const service = data?.data?.job;

  const shouldShowButtons = showButtons === "true";
  const shouldShowPrice = showPrice === "true";

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

  const renderButton = service?.priceRange?.isPersonalized ? (
    <BotttomButtons
      onPress={() => router.push("/provider/quote/updateQuote")}
      backgroundColor="#fff"
      color="#175994"
      borderColor="#175994"
      title="Send an updated offer"
      width="full"
    />
  ) : (
    <BotttomButtons
      onPress={() => router.push("/provider/home")}
      backgroundColor="#fff"
      color="#175994"
      borderColor="#175994"
      title="Accept"
      width={148}
    />
  );

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

      {shouldShowButtons && (
        <View
          className="flex-col gap-[1%] border border-[#D8DCE0]"
          style={[
            XStyle.shadowBox,
            {
              borderTopRightRadius: scale(20),
              borderTopLeftRadius: scale(20),
            },
          ]}
        >
          <View className="flex-row gap-[6%] justify-center overflow-hidden items-center">
            <BotttomButtons
              onPress={() => router.replace("/provider/home")}
              backgroundColor="#fff"
              color="#EF4444"
              borderColor="#EF4444"
              title="Cancel"
              width={service?.priceRange?.isPersonalized ? "full" : 148}
            />
            {renderButton}
          </View>

          {service?.priceRange?.isPersonalized && (
            <View className="px-[3%]">
              <CustomButton
                onPress={() => router.push("/provider/quote/updateQuote")}
                title="Update Quote"
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
