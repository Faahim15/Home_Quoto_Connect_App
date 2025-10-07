import { Text, View, TouchableOpacity, Image } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { Ionicons } from "@expo/vector-icons";
import RadioButton from "./RadioButton";
import MapTextField from "./MapTextField";
import ServiceDocumentUpload from "./DoucumentUpload";
import OfferPrice from "../../tabs/home/OfferPrice";
export default function QuoteDetails({ item }) {
  const serviceColors = {
    "TV repair and Installation": "bg-[#319FCA]",
    "AC Repair and Maintenance": "bg-[#FF6B6B]",
    "Plumbing Services": "bg-[#10B981]",
    "Electrical Repair": "bg-[#8B5CF6]",
  };

  function handleJobDetails() {}

  return (
    <View className="mx-[4%] mb-[4%]">
      {/* Service Type Banner - Made clickable */}
      <TouchableOpacity
        onPress={handleJobDetails}
        style={{
          borderTopLeftRadius: scale(8),
          borderTopRightRadius: scale(8),
        }}
        className={`px-[3.5%] py-[3%] flex-row items-center justify-between ${
          serviceColors[item?.serviceType] || "bg-gray-500"
        }`}
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
        <Text className="font-poppins-semiBold pb-[2%] text-base text-[#1F2937]">
          Posted by
        </Text>
        <View className="flex-row items-center gap-[4%]">
          {/* Profile Image */}
          <TouchableOpacity className="w-16 h-16 mb-[4%] rounded-full bg-blue-500 items-center justify-center">
            <Image
              source={{
                uri: item.profileImage,
              }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Provider Details */}
          <View className="flex-1 pb-[2%] ">
            <Text className="font-poppins-500medium text-xl text-gray-800 mb-1">
              {item.providerName}
            </Text>
          </View>
        </View>
        <View>
          {/* Appointment */}
          <View className="mt-[5%]">
            <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
              Appointment
            </Text>
            <Text className="font-poppins-400regular text-[#1F2937] text-xs pt-[2%] ">
              This service provider is available on 10th June 11 A.M.
            </Text>
          </View>
          <RadioButton />
          {/* Quote Details */}
          <View className="mt-[3%]">
            <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
              Write Quote Details
            </Text>
            <MapTextField />
          </View>
          {/* Warranty & Guarantee */}
          <View className="mt-[3%]">
            <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
              Warranty & Guarantee
            </Text>

            <MapTextField />
          </View>
          {/* Upload detailed Quote*/}
          <View className="mt-[3%]">
            <Text className="font-poppins-500medium pb-[2%] border-b border-[#DCDCDC] text-sm text-black">
              Upload Detailed Quote
            </Text>
            <ServiceDocumentUpload
              backgrounColor="#fff"
              title={null}
              content="License.pdf"
            />
          </View>
          {/* Price and Time */}
          <View className="flex-row mt-[3%] justify-between">
            <Text className="font-poppins-400regular pt-[4%] text-base text-[#1F2937]">
              Offer your price
            </Text>
            <OfferPrice />
          </View>
        </View>
      </View>
    </View>
  );
}
