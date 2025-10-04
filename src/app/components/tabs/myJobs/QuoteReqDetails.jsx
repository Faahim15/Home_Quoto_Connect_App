import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { router } from "expo-router";
import UpdatedOffer from "./UpdatedOffer";
export default function QuoteReqDetails({ item, quoteReq }) {
  const serviceColors = {
    "TV repair and Installation": "bg-[#319FCA]",
    "AC Repair and Maintenance": "bg-[#FF6B6B]",
    "Plumbing Services": "bg-[#10B981]",
    "Electrical Repair": "bg-[#8B5CF6]",
  };
  const handleServicePress = () => {
    router.push({
      pathname: "/myJobs/jobDetails",
      params: { serviceId: item.id, showButtons: true },
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
          className={`px-[3.5%] py-[3%] flex-row items-center justify-between ${
            serviceColors[item?.serviceType] || "bg-gray-500"
          }`}
          onPress={handleServicePress}
        >
          <Text className="text-white font-poppins-400regular text-base">
            {item.serviceType}
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
              onPress={
                () => {}
                //   navigation.navigate("SelectedProviderDetailsScreen", {
                //     showButtons: false,
                //     provider: item,
                //   })
              }
              className="w-16 h-16 mb-[4%] rounded-full bg-blue-500 items-center justify-center"
            >
              <Image
                source={{
                  uri: item.profileImage,
                }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </TouchableOpacity>

            {/* Provider Details */}
            <View className="flex-1">
              <Text className="font-poppins-500medium text-xl text-gray-800 mb-1">
                {item.providerName}
              </Text>

              {/* Rating */}
              <View className="flex-row items-center mb-[2%]">
                <Text className="text-[#F59E0B] font-poppins-400regular text-xs mr-1">
                  ★ {item.rating}
                </Text>
                <Text className="font-poppins-400regular text-[#18649F] text-xs">
                  ({item.reviews} Reviews)
                </Text>
              </View>

              {/* Price and Time */}
              <View className="flex-row justify-between">
                <Text className="font-poppins-400regular text-base text-[#1F2937]">
                  {item.quoteOption === "Accept" && "Price"}
                </Text>
                <Text className="text-[#F59E0B] text-base font-poppins-semiBold">
                  {item.quoteOption === "Accept"
                    ? item.price
                    : "Request a personalized quote"}
                </Text>
              </View>

              {/* Buttons */}
              {/* <View className="flex-row mt-[3%] gap-[3%] justify-evenly ">
              <ContactButton name="call-outline" title="Call" />
              <ContactButton name="chatbubble-outline" title="Message" />
            </View> */}
            </View>
          </View>

          <View>
            {/* Job Status */}

            <View className=" mt-[5%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Job Status
              </Text>
              {quoteReq ? (
                <Text className="font-poppins-400regular mt-[10%] text-center text-base text-[#F59E0B] ">
                  Pending
                </Text>
              ) : (
                <Text
                  className={`font-poppins-400regular mt-[10%] text-center text-base ${item.status === "In Progress" ? "text-[#1A73E8]" : item.status === "Completed" ? "text-[#00BFA5]" : "text-[#D32F2F]"} `}
                >
                  {item.status}
                </Text>
              )}
            </View>

            {!quoteReq && item.sentQuote && <UpdatedOffer />}

            {/* Appointment */}
            <View className="mt-[5%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Appointment
              </Text>

              <Text className="font-poppins-400regular text-[#1F2937] text-xs pt-[2%] ">
                This service provider is available on {item.bookingHours}
              </Text>
            </View>
            {/* Quote Details */}
            <View className="mt-[5%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Quote Details
              </Text>

              <Text className="font-poppins-400regular text-[#1F2937] text-xs pt-[2%] ">
                {item.description}
              </Text>
            </View>
            {/* Warranty & Guarantee */}
            <View className="mt-[5%]">
              <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
                Warranty & Guarantee
              </Text>

              <Text className="font-poppins-400regular text-[#1F2937] text-xs pt-[2%] ">
                All electrical work is backed by a 1-year workmanship guarantee.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
