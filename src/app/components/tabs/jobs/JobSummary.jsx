import { View, Text, Image, FlatList } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import XStyle from "../../../util/styles";
import PaymentChecklist from "./PaymentCheckList";
import imageData from "../../data/shared/Images";

function showImages({ item }) {
  return (
    <View>
      <Image
        source={item.image}
        style={{
          width: scale(90),
          height: verticalScale(80),
          borderRadius: scale(4),
        }}
      />
    </View>
  );
}
export default function JobSummary({
  quoteInfo,
  showPaymentCheckList = false,
}) {
  return (
    <View
      style={XStyle.shadowBox}
      className="py-[4%] px-[3%] mt-[3%] bg-white border border-[#D4E0EB] "
    >
      <View>
        <Text className="font-poppins-500medium text-base text-[#565656] ">
          Tv repair and installation
        </Text>
        <View className="border-b border-[#CACACA] mb-[2%] mt-[3%] ">
          <Image
            style={{ width: scale(310), height: verticalScale(177) }}
            className="rounded-md  mb-[2%] "
            source={require("../../../../../assets/images/home/jobs/summary1.png")}
          />
        </View>
        <View className="mt-[1%]">
          <FlatList
            data={imageData}
            renderItem={showImages}
            keyExtractor={(item) => item.id}
            horizontal
            ItemSeparatorComponent={() => (
              <View style={{ paddingRight: scale(10) }} />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View className="flex-col border-b border-[#CACACA] mb-[2%] w-full overflow-hidden">
          <View className="flex-col gap-[6%] mt-[3%]">
            <Text className="font-poppins-500medium text-xs text-[#5C5F62]">
              Job Details
            </Text>
            <Text className="font-poppins-400regular text-justify text-xs text-[#5C5F62] ">
              Need TV repair and wall-mount installation. TV and bracket already
              available.
            </Text>
          </View>
          {/* Service */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Service
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              Electrician
            </Text>
          </View>
          {/* Specializations */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Specializations
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              Home Installation, Repair
            </Text>
          </View>
          <View className="flex-row mt-[3%] w-[70%] gap-[25%] ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Address
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              Street no. 23 Ouch west road Alibagh, Alibagh, Ouch, 18750,
              Pakistan
            </Text>
          </View>
          {/* Booking Date */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Booking date
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              December 23, 2023
            </Text>
          </View>
          {/* Booking hours */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Booking Hours
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              10:00 AM
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <Text className="font-poppins-semiBold text-sm text-[#565656] ">
            Price
          </Text>
          <Text
            className={`font-poppins-semiBold text-sm ${quoteInfo.requiresPersonalizedQuote ? "text-[#F59E0B]" : "text-[#175994]"} `}
          >
            {quoteInfo.requiresPersonalizedQuote
              ? "Request a personlized quote"
              : quoteInfo.price}
          </Text>
        </View>
        {showPaymentCheckList && quoteInfo.status === "In Progress" && (
          <View className="py-[4%] mt-[3%] bg-[#F5F5F5] rounded-lg ">
            <PaymentChecklist />
          </View>
        )}
      </View>
    </View>
  );
}
