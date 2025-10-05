import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UpdatedOffer from "../../tabs/myJobs/UpdatedOffer";

const OfferDetailsModal = ({
  visible,
  onClose,
  offerData,
  onDecline,
  onApprove,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-[5%]">
        <View className="bg-[#f9f9f9] rounded-[4%] w-full max-w-[400px] p-[5%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-[5%]">
            <Text className="font-poppins-bold text-base text-[#F59E0B]">
              Offer Details
            </Text>
            <TouchableOpacity onPress={onClose} className="p-[2%]">
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Price Details */}
          <View className="bg-gray-50 rounded-[3%] p-[4%] mb-[5%]">
            {/* Previous Price */}
            <View className="flex-row justify-between items-center mb-[3%]">
              <Text className="font-poppins-semiBold text-sm text-gray-600">
                Previous Price:
              </Text>
              <Text className="text-xl text-gray-700 font-poppins-semiBold">
                ${offerData?.previousPrice?.toFixed(2) || "0.00"}
              </Text>
            </View>

            {/* Offer Price */}
            <View className="flex-row justify-between items-center mb-[3%]">
              <Text className="font-poppins-semiBold text-base text-[#F59E0B]">
                Offer Price:
              </Text>
              <Text className="text-xl text-[#F59E0B] font-poppins-bold">
                ${offerData?.offerPrice?.toFixed(2) || "0.00"}
              </Text>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-gray-300 my-[3%]" />

            {/* Total Price */}
            <View className="flex-row justify-between items-center mb-[2%]">
              <Text className="text-base font-poppins-bold text-gray-900">
                Total Price:
              </Text>
              <View className="bg-green-100 px-[4%] py-[1.5%] rounded-full">
                <Text className="text-base font-poppins-bold text-green-600">
                  $420.00
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <UpdatedOffer onApprove={onApprove} onDecline={onDecline} />
        </View>
      </View>
    </Modal>
  );
};
export default OfferDetailsModal;
