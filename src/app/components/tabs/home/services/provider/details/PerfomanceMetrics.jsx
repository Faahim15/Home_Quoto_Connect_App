import { View, Text, Image } from "react-native";
import XStyle from "../../../../../../util/styles";
import { scale, verticalScale } from "../../../../../adaptive/Adaptiveness";

export default function PerfomanceMetrics({ performanceData }) {
  return (
    <View
      style={[
        XStyle.lightShadow,
        { height: verticalScale(93), width: scale(327) },
      ]}
      className="flex-row justify-center items-center border rounded-lg border-[#D4E0EB] gap-[20%] bg-[#FFFFFF] mt-[3%] mx-[6%] "
    >
      <View>
        <Image
          source={require("../../../../../../../../assets/images/home/booked/completed.png")}
        />
        <Text className="font-poppins-500medium text-base text-[#565656]">
          {Number(performanceData?.avgRating) / 10 || "N/A"}
        </Text>
        <Text className="font-poppins-500medium text-[10px] text-[#565656]">
          Rating
        </Text>
      </View>
      <View>
        <Image
          source={require("../../../../../../../../assets/images/home/booked/expericence.png")} //../../../../../assets/images/home/booked/expericence.png
        />
        <Text className="font-poppins-500medium text-base text-[#565656]">
          {performanceData?.totalJobs || "N/A"} Orders
        </Text>
        <Text className="font-poppins-500medium text-[10px] text-[#565656]">
          completed
        </Text>
      </View>
      <View>
        <Image
          source={require("../../../../../../../../assets/images/home/booked/expericence.png")}
        />
        <Text className="font-poppins-500medium text-base text-[#565656]">
          Experience
        </Text>
        <Text className="font-poppins-500medium text-[10px] text-[#565656]">
          {performanceData?.experienceLevel || "N/A"}
        </Text>
      </View>
    </View>
  );
}
