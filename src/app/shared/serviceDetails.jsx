import { ScrollView, View, Text } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [myQuotes, setMyQuotes] = useState([]);

  const { data, isLoading, error } = useGetSingleJobQuery(serviceId);

  const shouldShowButtons = showButtons === "true";
  const shouldShowPrice = showPrice === "true";

  // Filter quotes based on userId from AsyncStorage
  useEffect(() => {
    const filterMyQuotes = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");

        if (userId && data?.data?.job?.quotes) {
          const filtered = data.data.job.quotes.filter(
            (quote) => quote.provider._id === userId
          );
          setMyQuotes(filtered);
        }
      } catch (error) {
        console.error("Error filtering quotes:", error);
      }
    };

    if (data) {
      filterMyQuotes();
    }
  }, [data]);

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

  // console.log("my filtered quotes", service?.status);
  const isAccepted = myQuotes?.some((quote) => quote?.status === "accepted");
  const serviceStatus =
    service?.status === "in_progress" || service?.status === "expired";
  // console.log("isAccepted", isAccepted, shouldShowButtons);
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

      {shouldShowButtons && !isAccepted && !serviceStatus && (
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
            {/* <BotttomButtons
              onPress={() => router.replace("/provider/home")}
              backgroundColor="#fff"
              color="#EF4444"
              borderColor="#EF4444"
              title="Cancel"
              width={service?.priceRange?.isPersonalized ? "full" : 148}
            /> */}
            {/* {renderButton} */}
          </View>

          <View className="px-[3%]">
            <CustomButton
              onPress={() =>
                router.push({
                  pathname: "/provider/quote/updateQuote",
                  params: { jobId: serviceId },
                })
              }
              title="Send an offer"
            />
          </View>
        </View>
      )}
    </View>
  );
}
