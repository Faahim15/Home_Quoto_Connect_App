import { Text, View, TouchableOpacity, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale } from "../../adaptive/Adaptiveness";
import { router } from "expo-router";
import UpdatedOffer from "./UpdatedOffer";
import { statusColorMap } from "../../../util/colors";
import { getStatusLabel } from "../../../util/helper-function";
export default function QuoteReqDetails({ item, quoteReq }) {
  const { quote, job } = item;
  const statusColor = statusColorMap?.[quote?.status] ?? "#6B7280";
  const { fullName, averageRating, profilePhoto, totalReviews, _id } =
    quote?.provider;

  const handleServicePress = () => {
    router.push({
      pathname: "/myJobs/jobDetails",
      params: { serviceId: job._id, showButtons: true },
    });
  };

  return (
    <View>
      <View className="mx-[4%] mb-[4%]">
        {/* Service Type Banner - Made clickable */}
        <Pressable
          style={{
            borderTopLeftRadius: scale(8),
            borderTopRightRadius: scale(8),
          }}
          className="px-[3.5%] bg-gray-500 py-[3%] flex-row items-center justify-between"
          onPress={handleServicePress}
        >
          <Text className="text-white font-poppins-400regular text-base">
            {job?.serviceCategory?.title || "N/A"}
          </Text>

          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </Pressable>

        <View
          style={{
            borderBottomRightRadius: scale(8),
            borderBottomLeftRadius: scale(8),
          }}
          className="px-[4%] py-[4%] border border-[#DCDCDC] rounded-sm bg-white"
        >
          <View className="flex-row items-center gap-[4%]">
            {/* Profile Image */}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/myJobs/serviceProfile",
                  params: { profileId: _id, showButtons: false },
                })
              }
              className="w-16 h-16 mb-[4%] rounded-full bg-blue-500 items-center justify-center"
            >
              <Image
                source={{
                  uri: profilePhoto?.url || null,
                }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </Pressable>

            {/* Provider Details */}
            <View className="flex-1">
              <Text className="font-poppins-500medium text-xl text-gray-800 mb-1">
                {fullName || "N/A"}
              </Text>

              {/* Rating */}
              <View className="flex-row items-center mb-[2%]">
                <Text className="text-[#F59E0B] font-poppins-400regular text-xs mr-1">
                  ★ {Number(averageRating) / 10 || "N/A"}
                </Text>
                <Text className="font-poppins-400regular text-[#18649F] text-xs">
                  ({totalReviews > 1 ? "Reviews" : "Review" || "N/A"})
                </Text>
              </View>

              {/* Price and Time */}
              <View className="flex-row justify-between">
                <Text className="font-poppins-400regular text-base text-[#1F2937]">
                  Price
                </Text>
                <Text className="text-[#F59E0B] text-base font-poppins-semiBold">
                  {`$${quote.price}`}
                </Text>
              </View>
            </View>
          </View>

          <View>
            {/* Job Status */}

            <View className=" mt-[5%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Quote Status
              </Text>
              <Text
                style={{ color: statusColor }}
                className="font-poppins-400regular mt-[10%] text-center text-base" //text-[#D32F2F] use if for cancelled
              >
                {getStatusLabel(quote?.status)}
              </Text>
            </View>

            {!quoteReq && item?.sentQuote && <UpdatedOffer />}

            {/* Appointment */}
            <View className="mt-[5%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Appointment
              </Text>

              <Text className="font-poppins-400regular text-[#1F2937] text-xs pt-[2%] ">
                This service provider is available on{" "}
                {quote?.proposedTime || "N/A"}
              </Text>
            </View>
            {/* Quote Details */}
            <View className="mt-[5%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Quote Details
              </Text>

              <Text className="font-poppins-400regular text-[#1F2937] text-xs pt-[2%] ">
                {quote?.description || "N/A"}
              </Text>
            </View>
            {/* Warranty & Guarantee */}
            <View className="mt-[5%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Warranty & Guarantee
              </Text>

              {/* Warranty */}
              <Text className="font-poppins-500medium text-[#1F2937] text-xs pt-[2%]">
                Warranty & Guarantee
              </Text>
              <Text className="font-poppins-400regular text-[#1F2937] text-xs pb-[2%]">
                {quote?.warranty?.details || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
