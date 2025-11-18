import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale } from "../../adaptive/Adaptiveness";
import { router } from "expo-router";
import UpdatedOffer from "./UpdatedOffer";
import { statusColorMap } from "../../../util/colors";
import { getStatusLabel } from "../../../util/helper-function";
import { formatDateWithOrdinal } from "../../../util/helper-function";
export default function QuoteProgressDetails({ quote, job }) {
  // console.log("show", item);
  const statusColor = statusColorMap?.[quote?.status] ?? "#6B7280";
  const { fullName, averageRating, profilePhoto, totalReviews } =
    quote?.provider;

  const handleServicePress = () => {
    router.push({
      pathname: "/myJobs/jobDetails",
      params: { serviceId: job._id, showButtons: false },
    });
  };
  return (
    <View>
      <View className="mx-[4%] mb-[4%]">
        {/* Service Type Banner - Made clickable */}
        <TouchableOpacity
          style={{
            borderTopLeftRadius: scale(8),
            borderTopRightRadius: scale(8),
          }}
          className="px-[3.5%] py-[3%] flex-row items-center justify-between bg-gray-500"
          onPress={handleServicePress}
        >
          <Text className="text-white font-poppins-400regular text-base">
            {job?.serviceCategory?.title || "N/A"}
          </Text>

          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>

        <View
          style={{
            borderBottomRightRadius: scale(8),
            borderBottomLeftRadius: scale(8),
          }}
          className="px-[4%] py-[4%] border border-[#DCDCDC] rounded-sm bg-white"
        >
          <View className="flex-row items-center gap-[4%]">
            {/* Profile Image */}
            <TouchableOpacity
              onPress={() => {}}
              className="w-16 h-16 mb-[4%] rounded-full bg-blue-500 items-center justify-center"
            >
              <Image
                source={{
                  uri: profilePhoto?.url || null,
                }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </TouchableOpacity>

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
                  {/* {item.quoteOption === "Accept" && "Price"} */}
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
              {quote?.isUpdated ? (
                <UpdatedOffer
                  quoteId={quote?._id}
                  onSuccess={() => router.back()}
                />
              ) : (
                <Text
                  style={{ color: statusColor }}
                  className="font-poppins-400regular mt-[10%] text-center text-base "
                >
                  {getStatusLabel(job?.status)}
                </Text>
              )}
            </View>

            {/* {item.sentQuote && <UpdatedOffer />} */}

            {/* Appointment */}
            <View className="mt-[5%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Appointment
              </Text>

              <Text className="font-poppins-400regular text-[#1F2937] text-xs pt-[2%] ">
                Available on {formatDateWithOrdinal(quote?.proposedDate)} at{" "}
                {quote?.proposedTime}.
              </Text>
            </View>
            {/* Quote Details */}
            <View className="mt-[5%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Quote Details
              </Text>

              <Text className="font-poppins-400regular text-[#1F2937] text-xs pt-[2%] ">
                {quote?.description}
              </Text>
            </View>
            {/* Warranty & Guarantee */}
            <View className="mt-[5%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Warranty & Guarantee
              </Text>

              <Text className="font-poppins-400regular text-[#1F2937] text-xs pt-[2%] ">
                {quote?.warranty?.details || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
