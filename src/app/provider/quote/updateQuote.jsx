import { View, Text, ScrollView } from "react-native";
import CustomTitle from "../../components/shared/services/CustomTitle";
import QuoteDetails from "../../components/provider/home/UpdateQuote";
import { Ionicons } from "@expo/vector-icons";
import BotttomButtons from "../../components/shared/services/buttons/BottomButtons";
import XStyle from "../../util/styles";
import { scale } from "../../components/adaptive/Adaptiveness";
import { router } from "expo-router";

export default function UpdateQuoteScreen() {
  const quoteInfo = {
    id: 1,
    serviceType: "TV repair and Installation",
    designation: "TV Technician",
    providerName: "Jackson",
    description: "Expert in fixing and installing all types of TVs.",
    rating: 4.8,
    reviews: 8,
    price: "$320",
    timeAgo: "14 m Ago",
    bookingDate: "2025-07-16",
    bookingHours: "10:00 AM - 12:00 PM",
    specializations: ["LED TV", "Smart TV", "Wall Mount Installation"],
    address: "123 Green Street, Los Angeles, CA",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    status: "In Progress",
  };
  return (
    <View className="flex-1  bg-[#F9F9F9]">
      <View className="px-[4%]">
        <CustomTitle title="Update Quote" />
      </View>
      <ScrollView>
        <View className="mt-[3%]">
          <QuoteDetails item={quoteInfo} />
        </View>
        {/* Info Text */}
        <View className="flex-row px-[4%] items-center mb-[2%]">
          <Ionicons name="bulb-outline" size={18} color="#f59e0b" />
          <Text className="font-poppins-400regular  text-justify w-[90%] text-xs text-[#1F2937] ml-[2%]">
            Submitting this quote will cost 5 credits. Your current balance is
            25 credits.
          </Text>
        </View>
      </ScrollView>
      <View
        className="flex-row gap-[6%] h-[14%]  border border-[#D8DCE0] justify-center items-center "
        style={[
          XStyle.shadowBox,
          { borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20) },
        ]}
      >
        <BotttomButtons
          onPress={() => router.back()}
          backgroundColor="#fff"
          color="#EF4444"
          borderColor="#EF4444"
          title="Cancel"
        />
        <BotttomButtons
          onPress={() => router.replace("/provider/home")}
          backgroundColor="#2583B6"
          color="#fff"
          borderColor="#2583B6"
          title="Send Updated Quote"
          width="full"
        />
      </View>
    </View>
  );
}
