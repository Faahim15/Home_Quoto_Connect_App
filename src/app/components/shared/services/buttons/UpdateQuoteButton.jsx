import { View } from "react-native";
import CustomButton from "./ServiceButton";
import { router } from "expo-router";
import XStyle from "../../../../util/styles";
import { scale } from "../../../adaptive/Adaptiveness";

export default function UpdateQuoteButton({ title }) {
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
        <CustomButton
          onPress={() =>
            router.push({
              pathname: "/provider/quote/updateQuote",
              params: { jobId: serviceId },
            })
          }
          title={title}
        />
      </View>
    </View>
  );
}
