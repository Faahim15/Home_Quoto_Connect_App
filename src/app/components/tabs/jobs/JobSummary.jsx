import { View, Text, FlatList } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { Image } from "expo-image";
import XStyle from "../../../util/styles";
import {
  capitalizeFirstLetter,
  formatDateForCanada,
  getStatusLabel,
} from "../../../util/helper-function";
import { statusColorMap } from "../../../util/colors";
import { Ionicons } from "@expo/vector-icons";
function showImages({ item }) {
  return (
    <View>
      <Image
        source={{ uri: item?.url }}
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
  const {
    title,
    description,
    serviceCategory,
    photos,
    specializations,
    preferredDate,
    preferredTime,
    priceRange,
  } = quoteInfo?.job || {};
  const { profilePhoto, fullName } = quoteInfo?.job?.client || {};
  const { city, state } = quoteInfo?.job?.location?.details || {};
  const statusColor = statusColorMap?.[quoteInfo?.status] ?? "#6B7280";

  return (
    <View
      style={XStyle.shadowBox}
      className="py-[4%] px-[3%] mt-[3%] bg-white border border-[#D4E0EB] "
    >
      <View>
        <Text className="font-poppins-500medium text-base text-[#565656] ">
          {title || "N/A"}
        </Text>
        <View className="border-b border-[#CACACA] mb-[2%] mt-[3%] ">
          <Image
            style={{ width: scale(310), height: verticalScale(177) }}
            className="rounded-md  mb-[2%] "
            source={{ uri: photos[0]?.url | null }}
          />
        </View>
        {/* ✅ Fix FlatList - check if photoData has items */}
        {photos && photos.length > 0 && (
          <View className="mt-[1%]">
            <FlatList
              data={photos}
              renderItem={showImages}
              keyExtractor={(item) =>
                item?._id || item?.url || Math.random().toString()
              }
              horizontal
              ItemSeparatorComponent={() => (
                <View style={{ paddingRight: scale(10) }} />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        <View className="flex-col border-b border-[#CACACA] mb-[2%] w-full overflow-hidden">
          <View className="flex-col gap-[6%] mt-[3%]">
            <Text className="font-poppins-500medium text-xs text-[#5C5F62]">
              Job Details
            </Text>
            <Text className="font-poppins-400regular text-justify text-xs text-[#5C5F62] ">
              {description || "N/A"}
            </Text>
          </View>
          {/* Service */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Service
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {capitalizeFirstLetter(serviceCategory?.title) || "N/A"}
            </Text>
          </View>
          {/* Specializations */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Specializations
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {specializations[0]?.title}{" "}
              {specializations?.length > 1
                ? `+${specializations.length - 1}`
                : ""}
            </Text>
          </View>
          <View className="flex-row mt-[3%] justify-between gap-[25%] ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Address
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {city && state ? `${city}, ${state}` : "N/A"}
            </Text>
          </View>
          {/* Booking Date */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Booking date
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {formatDateForCanada(preferredDate) || "N/A"}
            </Text>
          </View>
          {/* Booking hours */}
          <View className="flex-row mt-[3%] justify-between ">
            <Text className="font-poppins-semiBold text-xs text-[#6B7280]">
              Booking Hours
            </Text>
            <Text className="font-poppins-400regular text-justify overflow-hidden text-xs text-[#565656]">
              {preferredTime || "N/A"}
            </Text>
          </View>
        </View>

        {/* Posted by */}
        <Text className="font-poppins-semiBold text-base text-[#1F2937]">
          Posted by
        </Text>
        <View className="flex-row gap-[4%] pb-[2%] border-b border-[#CACACA]">
          {profilePhoto?.url ? (
            <Image
              style={{
                width: scale(40),
                height: verticalScale(40),
                borderRadius: scale(20),
              }}
              source={{ uri: profilePhoto.url }}
              className="mt-[2%]"
            />
          ) : (
            <View
              style={{
                width: scale(40),
                height: verticalScale(40),
                borderRadius: scale(20),
              }}
              className="mt-[2%] bg-gray-100 items-center justify-center"
            >
              <Ionicons name="person" size={scale(20)} color="#9CA3AF" />
            </View>
          )}
          <View className="mt-[2%]">
            <Text className="font-poppins-500medium text-xl text-[#1F2937]">
              {fullName || "N/A"}
            </Text>
          </View>
        </View>

        {/* {showPaymentCheckList && quoteInfo.status === "Completed" && (
          <View className="py-[4%] mt-[3%] bg-[#F5F5F5] rounded-lg ">
            <PaymentChecklist />
          </View>
        )} */}
      </View>
    </View>
  );
}
