// ServiceQuoteModal.js
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import MapButton from "../../provider/map/MapButton";
import { router } from "expo-router";
export default function ServiceQuoteModal({ visible, onClose, selectedJob }) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  // console.log("showing selected job from map:", selectedJob?.location);

  const handleJobDetails = () => {
    onClose();
    router.push({
      pathname: "myJobs/mapJobDetails",
      params: { serviceId: selectedJob?._id, showButtons: true },
    });
  };

  const { profilePhoto, fullName } = selectedJob?.client || {};
  const { city, state } = selectedJob?.location?.details || {};
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleJobDetails}
        className="flex-1  bg-black/50 justify-center items-center "
      >
        <View className="" activeOpacity={1}>
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
            className="bg-white border border-[#319FCA] rounded-md px-[5%] pt-[5%]"
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-[4%] right-[4%] z-10 bg-white rounded-full p-[2%] shadow-lg"
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            {/* Image */}
            <View className="w-full h-[180px] rounded-[16px] overflow-hidden mb-[2%]">
              <Image
                source={{
                  uri: selectedJob?.serviceCategory?.image?.url || null,
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className=" pt-[4%]">
              {/* Title */}
              <Text
                className="text-gray-900 font-poppins-500medium text-base mb-[2%]"
                numberOfLines={2}
              >
                {selectedJob?.title || "N/A"}
              </Text>

              {/* Author */}
              <View className="flex-row items-center mb-[2%]">
                <Image
                  source={{
                    uri: profilePhoto?.url || null,
                  }}
                  style={{ width: scale(16), height: verticalScale(16) }}
                  className=" bg-gray-300 rounded-full mr-[2%]"
                />
                <Text className="font-poppins-400regular text-sm">
                  by{" "}
                  <Text className="font-poppins-400regular text-[#319FCA] text-sm ">
                    {fullName || "N/A"}
                  </Text>
                </Text>
              </View>

              {/* Service Type */}
              <View className="flex-row gap-[2%] items-center mb-[2%]">
                <Ionicons name="construct-outline" size={16} color="#6B7280" />
                <Text className="font-poppins-400regular text-sm text-[#6B7280] ">
                  {selectedJob?.serviceCategory?.title}
                </Text>
              </View>

              {/* Location and Time */}
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={16} color="#319FCA" />
                <Text className="text-gray-500 text-sm ml-[1%]"></Text>

                <Text className="font-poppins-400regular text-sm text-[#319FCA] ">
                  {city && state ? `${city}, ${state}` : "N/A"}
                  <Text className="text-[#6B7280]">
                    | {selectedJob?.timeAgo}
                  </Text>
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-poppins-semiBold text-sm text-[#6B7280] ">
                Price
              </Text>
              <Text className="font-poppins-semiBold text-sm  text-[#F59E0B]">
                {selectedJob?.priceRange?.isPersonalized
                  ? "Request a personalized..."
                  : `$${selectedJob?.priceRange?.from || null}-$${selectedJob?.priceRange?.to || null}`}
              </Text>
            </View>
            {/* Buttons */}
            <View className="flex-row gap-[4%] mt-[4%] mb-[3=2%]">
              <MapButton
                onPress={() => {
                  onClose();
                  router.push("/provider/quote/updateQuote");
                }}
                title="Update Quote"
              />
              <MapButton
                onPress={() => {
                  onClose();
                  router.replace("/provider/myJobs");
                }}
                borderColor="#175994"
                backgroundColor="#fff"
                title="Accept Offer"
                color="#175994"
              />
            </View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
