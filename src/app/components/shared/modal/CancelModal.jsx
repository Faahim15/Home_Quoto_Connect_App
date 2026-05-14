import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "../../adaptive/Adaptiveness";
import { toast } from "sonner-native";
import { router } from "expo-router";
export default function CancelModal({ visible, onClose, onConfirm }) {
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReason, setOtherReason] = useState("");

  const cancelReasons = [
    "I found a better price elsewhere",
    "I need to reschedule",
    "Service no longer needed",
    "Provider is not available",
    "Change of plans",
    "Other",
  ];

  const handleCancel = () => {
    const reason = selectedReason === "Other" ? otherReason : selectedReason;
    if (onConfirm) {
      onConfirm(reason);
    }
    // Show success toast
    toast.success("Your booking has been successfully cancelled.");

    // Reset state
    setSelectedReason(null);
    setOtherReason("");
    onClose();
    router.back();
  };

  const handleClose = () => {
    // Reset state when closing
    setSelectedReason(null);
    setOtherReason("");
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl h-[75%]">
          {/* Header */}
          <View className="flex-row justify-between items-center px-[6%] py-[5%] border-b border-gray-200">
            <Text className="text-xl font-poppins-bold text-gray-800">
              Cancel Booking
            </Text>
            <Pressable onPress={handleClose}>
              <Ionicons name="close" size={28} color="#666" />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingBottom: verticalScale(40) }}
            className="flex-1 px-[6%] py-[4%]"
          >
            {/* Warning Message */}
            <View className="bg-red-50 border border-red-200 rounded-lg p-[4%] mb-[5%] flex-row">
              <Ionicons name="warning" size={22} color="#EF4444" />
              <Text className="text-red-600 font-poppins-400regular ml-[3%] flex-1 text-xs">
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </Text>
            </View>

            {/* Reason Section */}
            <Text className="text-base font-poppins-semiBold text-gray-800 mb-[3%]">
              Please select a reason for cancellation:
            </Text>

            {/* Reason Options */}
            {cancelReasons.map((reason, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedReason(reason)}
                className={`flex-row items-center p-[4%] mb-[2.5%] rounded-lg border ${
                  selectedReason === reason
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <View
                  className={`w-[20px] h-[20px] rounded-full border-2 mr-[3%] items-center justify-center ${
                    selectedReason === reason
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-400"
                  }`}
                >
                  {selectedReason === reason && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text
                  className={`flex-1  ${
                    selectedReason === reason
                      ? "text-blue-700 tex-sm font-poppins-500medium"
                      : "text-gray-700 text-xs font-poppins-400regular"
                  }`}
                >
                  {reason}
                </Text>
              </Pressable>
            ))}

            {/* Other Reason Input */}
            {selectedReason === "Other" && (
              <View className="mt-[3%]">
                <Text className="text-sm font-poppins-500medium text-gray-700 mb-[2%]">
                  Please specify:
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg p-[3.5%] text-gray-800"
                  placeholder="Enter your reason here..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={otherReason}
                  onChangeText={setOtherReason}
                  placeholderTextColor="#898989"
                  style={{ minHeight: verticalScale(80) }}
                />
              </View>
            )}

            {/* Refund Policy */}
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-[4%] mt-[5%]">
              <View className="flex-row  items-center mb-[2%]">
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <Text className="text-blue-700 pt-[1%]  font-poppins-500medium ml-[2%]">
                  Refund Policy
                </Text>
              </View>
              <Text className="text-blue-600 font-poppins-400regular text-xs">
                Cancellations made more than 24 hours before the booking are
                eligible for a full refund. Late cancellations may incur a fee.
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="px-[6%] py-[4%] border-t border-gray-200">
            <Pressable
              onPress={handleCancel}
              disabled={
                !selectedReason ||
                (selectedReason === "Other" && !otherReason.trim())
              }
              className={`rounded-lg py-[4%] mb-[3%] ${
                selectedReason &&
                (selectedReason !== "Other" || otherReason.trim())
                  ? "bg-red-500"
                  : "bg-gray-300"
              }`}
            >
              <Text className="text-white text-center font-poppins-semiBold text-base">
                Confirm Cancellation
              </Text>
            </Pressable>

            <Pressable
              onPress={handleClose}
              className="bg-white border border-gray-300 rounded-lg py-[4%]"
            >
              <Text className="text-gray-700 text-center font-poppins-semiBold text-base">
                Keep Booking
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
