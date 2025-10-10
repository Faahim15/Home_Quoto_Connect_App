import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  scale,
  verticalScale,
} from "../../../components/adaptive/Adaptiveness";
import BotttomButtons from "../../shared/services/buttons/BottomButtons";
import CustomButton from "../../shared/services/buttons/ServiceButton";
import serviceData from "../../data/provider/MyJobsData";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import CancelModal from "../../../components/shared/modal/CancelModal";
import Toast from "react-native-toast-message";
const ServiceCard = ({ item }) => {
  const handlePress = useCallback(() => {
    router.push({
      pathname: "/provider/myJobs/quoteRequest",
      params: { serviceId: item.id },
    });
  }, [item]);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const handleCancelConfirm = (reason) => {
    console.log("Cancellation reason:", reason);
  };
  const appointmentData = {
    service: "TV repair",
    provider: "Jackson",
    price: "320",
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ width: scale(327), height: verticalScale(270) }}
      className=" bg-white  mr-[0.5%]  flex-col justify-center   border border-[#D4E0EB] px-[4.5%]  rounded-xl shadow-sm overflow-hidden"
    >
      <View className="flex-row mt-[2%] ">
        {/* User Image */}
        <View className="">
          <Image
            source={{ uri: item.authorImage }}
            style={{ width: scale(48), height: verticalScale(48) }}
            className=" bg-gray-300 mt-[12%] rounded-full mr-[2%]"
          />
        </View>

        {/* Card Content */}
        <View className=" ">
          {/* Title */}
          <Text
            className="text-gray-900 font-poppins-500medium text-base mt-[2%] "
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {/* Author */}
          <View className="flex-row items-center mt-[4%]">
            <Text className="font-poppins-400regular text-sm">
              by{" "}
              <Text className="font-poppins-400regular text-[#319FCA] text-sm ">
                {item.author}
              </Text>
            </Text>
          </View>

          {/* Service Type */}
          <View className="flex-row gap-[2%] items-center mt-[4%]">
            <Ionicons name="construct-outline" size={16} color="#6B7280" />
            <Text className="font-poppins-400regular text-sm text-[#6B7280] ">
              {item.service}
            </Text>
          </View>

          {/* Location and Time */}
          <View className="flex-row items-center mt-[4%]">
            <Ionicons name="location-outline" size={16} color="#319FCA" />
            <Text className="text-gray-500 text-sm ml-[1%]"></Text>

            <Text className="font-poppins-400regular text-sm text-[#319FCA] ">
              {item.location}{" "}
              <Text className="text-[#6B7280]">| {item.time}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Price section */}

      <View className="flex-row mt-[4%] justify-between">
        <Text className="font-poppins-400regular text-base text-[#1F2937] ">
          Price
        </Text>
        <Text className="font-poppins-semiBold text-base text-[#F59E0B] ">
          {item.requiresPersonalizedQuote
            ? "Request a personalized quote"
            : `${item.price}`}
        </Text>
      </View>

      {/* buttons section */}

      <View className="flex-row  gap-[2%] mt-[5%] ">
        <BotttomButtons
          onPress={() => {
            setCancelModalVisible(true);
          }}
          width={145}
          backgroundColor="#fff"
          color="#EF4444"
          borderColor="#EF4444"
          title="Cancel"
        />
        {!item.requiresPersonalizedQuote ? (
          <BotttomButtons
            onPress={() => {
              Toast.show({
                type: "success",
                text1: "Offer Accepted",
                text2: "You've successfully accepted the offer.",
                position: "top",
                topOffset: 60,
                visibilityTime: 3000,
              });
              router.replace("/provider/home");
            }}
            width={145}
            backgroundColor="#fff"
            color="#175994"
            borderColor="#175994"
            title="Accept offer "
          />
        ) : (
          <BotttomButtons
            onPress={() => router.push("/provider/quote/updateQuote")}
            width={145}
            backgroundColor="#fff"
            color="#175994"
            borderColor="#175994"
            title="Update Quote"
          />
        )}
      </View>
      {!item.requiresPersonalizedQuote && (
        <View className="flex-1">
          <CustomButton
            onPress={() => router.push("/provider/quote/updateQuote")}
            title="Update Quote"
          />
        </View>
      )}
      <CancelModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelConfirm}
        appointmentDetails={appointmentData}
      />
    </TouchableOpacity>
  );
};

export default function QuotesRequestScreen() {
  return (
    <View className={`justify-center items-center  bg-[#f9f9f9] mt-[4%]`}>
      <FlatList
        data={serviceData}
        renderItem={({ item }) => <ServiceCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(100),
          rowGap: verticalScale(12),
        }}
        // snapToInterval={264} // Adjusted: 260 (card width) + 4 (margins)
        // // decelerationRate="fast"
        snapToAlignment="start" // Ensures proper snapping alignment
      />
    </View>
  );
}
