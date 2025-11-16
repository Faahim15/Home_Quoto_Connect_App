import { View } from "react-native";
import CustomButton from "./ServiceButton";
import { router } from "expo-router";
import XStyle from "../../../../util/styles";
import { scale } from "../../../adaptive/Adaptiveness";

export default function UpdateQuoteButton({ title, serviceId, quoteId }) {
  const handleUpdateOfferButton = () => {
    if (title === "Send an offer") {
      router.push({
        pathname: "/provider/quote/updateQuote",
        params: { jobId: serviceId },
      });
    } else {
      (console.log("send an updated offer", quoteId),
        router.push({
          pathname: "/provider/quote/updatedOffer",
          params: { jobId: serviceId, quoteId: quoteId },
        }));
    }
  };

  return (
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
      <View className="px-[3%]">
        <CustomButton onPress={handleUpdateOfferButton} title={title} />
      </View>
    </View>
  );
}
