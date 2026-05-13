import { View, Text, Modal, Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import MapButton from "../../provider/map/MapButton";
import { router } from "expo-router";
import { Image } from "expo-image";
import BotttomButtons from "../services/buttons/BottomButtons";
import { useUserProfileQuery } from "../../../../redux/features/apiSlices/user/userApiSlices";

export default function ServiceQuoteModal({ visible, onClose, selectedJob }) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { data: profile, isLoading: profileLoading } = useUserProfileQuery();

  const isVerified = profile?.data?.user?.verificationStatus === "verified";

  const handleJobDetails = () => {
    onClose();
    router.push({
      pathname: "myJobs/mapJobDetails",
      params: { serviceId: selectedJob?._id, showButtons: true },
    });
  };

  const handleUpdateQuote = () => {
    if (!isVerified) {
      console.log("Provider is not verified");
      return;
    }
    router.push({
      pathname: "/provider/quote/provideUpdatedOffer",
      params: { jobId: selectedJob?._id },
    });
    onClose();
  };

  const { profilePhoto, fullName } = selectedJob?.client || {};
  const { city, state } = selectedJob?.location?.details || {};
  const hasImage = !!selectedJob?.serviceCategory?.image?.url;
  const hasProfilePhoto = !!profilePhoto?.url;

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
      {/* ✅ Centered backdrop — tapping backdrop closes modal */}
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/50 justify-center items-center px-[4%]"
      >
        {/* ✅ Stop propagation so tapping card doesn't close modal */}
        <Pressable onPress={handleJobDetails} className="w-full">
          <Animated.View
            // style={{ transform: [{ translateY: slideAnim }] }}
            className="bg-white rounded-2xl overflow-hidden"
          >
            {/* ── Image / Placeholder ── */}
            {hasImage ? (
              <View style={{ height: verticalScale(180) }} className="w-full">
                <Image
                  source={{ uri: selectedJob?.serviceCategory?.image?.url }}
                  className="w-full h-full"
                  contentFit="cover"
                />
              </View>
            ) : (
              // ✅ Fallback placeholder when no image
              <View
                style={{ height: verticalScale(130) }}
                className="w-full bg-[#EBF5FB] justify-center items-center"
              >
                <Ionicons name="briefcase-outline" size={48} color="#319FCA" />
                <Text className="font-poppins-400regular text-xs text-[#319FCA] mt-[2%]">
                  No image available
                </Text>
              </View>
            )}

            {/* ── Close Button ── */}
            <Pressable
              onPress={onClose}
              className="absolute top-[3%] right-[3%] z-10 bg-white/90 rounded-full p-[1.5%] shadow"
            >
              <Ionicons name="close" size={22} color="#333" />
            </Pressable>

            {/* ── Content ── */}
            <View className="px-[5%] pt-[4%] pb-[4%]">
              {/* Title */}
              <Text
                className="text-gray-900 font-poppins-500medium text-base mb-[3%]"
                numberOfLines={2}
              >
                {selectedJob?.title || "N/A"}
              </Text>

              {/* Author */}
              <View className="flex-row items-center mb-[3%]">
                {hasProfilePhoto ? (
                  <Image
                    source={{ uri: profilePhoto?.url }}
                    style={{ width: scale(18), height: verticalScale(18) }}
                    className="bg-gray-300 rounded-full mr-[2%]"
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={18}
                    color="#319FCA"
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text className="font-poppins-400regular text-sm">
                  by{" "}
                  <Text className="font-poppins-400regular text-[#319FCA] text-sm">
                    {fullName || "N/A"}
                  </Text>
                </Text>
              </View>

              {/* Service Type */}
              <View className="flex-row gap-[2%] items-center mb-[3%]">
                <Ionicons name="construct-outline" size={16} color="#6B7280" />
                <Text className="font-poppins-400regular text-sm text-[#6B7280]">
                  {selectedJob?.serviceCategory?.title || "N/A"}
                </Text>
              </View>

              {/* Location and Time */}
              <View className="flex-row items-center mb-[3%]">
                <Ionicons name="location-outline" size={16} color="#319FCA" />
                <Text className="font-poppins-400regular text-sm text-[#319FCA] ml-[1%]">
                  {city && state ? `${city}, ${state}` : "N/A"}
                  <Text className="text-[#6B7280]">
                    {" "}
                    | {selectedJob?.timeAgo || "N/A"}
                  </Text>
                </Text>
              </View>

              {/* Price */}
              <View className="flex-row justify-between items-center mb-[4%]">
                <Text className="font-poppins-semiBold text-sm text-[#6B7280]">
                  Price
                </Text>
                <Text className="font-poppins-semiBold text-sm text-[#F59E0B]">
                  {selectedJob?.priceRange?.isPersonalized
                    ? "Request a personalized..."
                    : `$${selectedJob?.priceRange?.from || 0}-$${selectedJob?.priceRange?.to || 0}`}
                </Text>
              </View>

              {/* Buttons */}
              <View className="flex-row gap-[4%]">
                <BotttomButtons
                  onPress={() => {
                    onClose();
                    router.back();
                  }}
                  backgroundColor="#fff"
                  color="#EF4444"
                  borderColor="#EF4444"
                  title="Cancel"
                />
                <MapButton
                  onPress={handleUpdateQuote}
                  title="Update Quote"
                  disabled={profileLoading || !isVerified}
                />
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
