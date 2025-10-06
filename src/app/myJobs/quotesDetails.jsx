import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { scale } from "../components/adaptive/Adaptiveness";
import QuoteReqData from "../components/data/jobs/QuotesData";
import XStyle from "../util/styles";
import BotttomButtons from "../components/shared/services/buttons/BottomButtons";
import { router, useLocalSearchParams } from "expo-router";
import CustomTitle from "../components/shared/services/CustomTitle";
import QuoteReqDetails from "../components/tabs/myJobs/QuoteReqDetails";
import Toast from "react-native-toast-message";
export default function QuoteDetails() {
  const { serviceId, quoteReq } = useLocalSearchParams();
  const quoteReqst = quoteReq === "true";

  const item = QuoteReqData.find((s) => s.id.toString() === serviceId);

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="px-[4%]">
        <CustomTitle title="Quote Details" />
      </View>
      <ScrollView>
        <QuoteReqDetails quoteReq={quoteReqst} item={item} />
      </ScrollView>
      <View
        className="flex-row gap-[6%] h-[14%]  border border-[#D8DCE0] justify-center items-center "
        style={[
          XStyle.shadowBox,
          { borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20) },
        ]}
      >
        <BotttomButtons
          onPress={() => {
            Toast.show({
              type: "error",
              text1: "Request Declined",
              text2: "The provider has been notified of your decision",
              position: "top",
              visibilityTime: 3000,
            });
            router.back();
          }}
          backgroundColor="#fff"
          color="#EF4444"
          borderColor="#EF4444"
          title="Decline"
        />
        <BotttomButtons
          onPress={() => {
            Toast.show({
              type: "success",
              text1: "Job Accepted",
              text2: "You've successfully accepted the job.",
            });
            router.back();
          }}
          backgroundColor="#18649F"
          color="#fff"
          borderColor="#18649F"
          title="Accept"
        />
      </View>
    </View>
  );
}
