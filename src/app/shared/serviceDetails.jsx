import { ScrollView, Text, View } from "react-native";
import CustomTitle from "../components/shared/services/CustomTitle";
import ProviderInfo from "../components/shared/services/JobDetails";
import ActionButton from "../components/shared/services/buttons/ActionButton";
import XStyle from "../util/styles";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import BotttomButtons from "../components/shared/services/buttons/BottomButtons";
import CustomButton from "../components/shared/services/buttons/ServiceButton";
import { router, useLocalSearchParams } from "expo-router";
import servicesData from "../components/data/shared/ServicesData";
export default function ServiceDetails() {
  const { serviceId, showButtons, showPrice } = useLocalSearchParams();

  const service = servicesData.find((s) => s.id.toString() === serviceId);
  const renderButton =
    service.quoteOption === "Send a Personalized Quote" ? (
      <BotttomButtons
        onPress={() => router.push("/provider/quote/updateQuote")}
        backgroundColor="#fff"
        color="#175994"
        borderColor="#175994"
        title="  Send an updated offer"
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
  const shouldShowButtons = showButtons === "true";
  const shouldShowPrice = showPrice === "true";
  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="flex-1 mb-[2%]  px-[6%] bg-[#F9F9F9]">
        <CustomTitle title={service.serviceType} />
        <ScrollView
          contentContainerStyle={{ paddingBottom: verticalScale(40) }}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <ProviderInfo showPrice={shouldShowPrice} serviceData={service} />
          </View>
          {/* {showCompleteJob && (
            <View className="mt-[8%] ">
              <ActionButton route="ReviewFormScreen" title="Complete Job" />
            </View>
          )} */}
        </ScrollView>
      </View>
      {shouldShowButtons && (
        <View
          className="flex-col gap-[1%]   border border-[#D8DCE0]  "
          style={[
            XStyle.shadowBox,
            {
              borderTopRightRadius: scale(20),
              borderTopLeftRadius: scale(20),
              // height: verticalScale(140),
            },
          ]}
        >
          <View className="flex-row gap-[6%]  justify-center overflow-hidden items-center ">
            <BotttomButtons
              onPress={() => {
                router.replace("/provider/home");
              }}
              backgroundColor="#fff"
              color="#EF4444"
              borderColor="#EF4444"
              title="Cancel"
              width={
                service.quoteOption === "Send a Personalized Quote"
                  ? "full"
                  : 148
              }
            />

            {renderButton}
          </View>
          {service.quoteOption !== "Send a Personalized Quote" && (
            <View className="px-[3%]">
              <CustomButton
                onPress={() => router.push("/provider/quote/updateQuote")}
                title="Update Quote"
              />
            </View>
          )}
        </View>
      )}
      {/* {AllReq && (
        <View className="px-[6%] pb-[8%]">
          <CustomButton route="JobFormScreen" title="Edit Job" />
        </View>
      )} */}
    </View>
  );
}
