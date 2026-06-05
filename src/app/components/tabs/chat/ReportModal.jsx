import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IncidentTypeDropdown from "./IncidentType";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

const ReportModal = ({ visible, onClose, onSelectProvider, userData }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleProviderSelect = (providerId) => {
    if (providerId === "report") {
      setShowReportForm(true);
    } else {
      onSelectProvider?.(providerId);
      onClose();
    }
  };

  const handleCloseModal = () => {
    setShowReportForm(false);
    setSelectedIncident("");
    setAdditionalNotes("");
    onClose();
  };

  const handleSubmitReport = () => {
    // Handle report submission

    onSelectProvider?.("report", { selectedIncident, additionalNotes });
    handleCloseModal();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleCloseModal}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-[5%]"
        onPress={handleCloseModal}
      >
        <Pressable
          className="bg-white rounded-2xl w-full max-w-[90%] shadow-lg"
          onPress={(e) => e.stopPropagation()}
        >
          {showReportForm ? (
            // Report Form
            <View
              className="max-h-[100%]  "
              showsVerticalScrollIndicator={true}
            >
              <View className="p-[5%]">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-[6%]">
                  <Pressable
                    onPress={() => setShowReportForm(false)}
                    className="p-2"
                  >
                    <Ionicons name="arrow-back" size={20} color="#666" />
                  </Pressable>
                  <Text className="text-lg font-semibold text-gray-800">
                    Report
                  </Text>
                  <Pressable
                    onPress={handleCloseModal}
                    className="p-2 rounded-full bg-gray-100"
                  >
                    <Ionicons name="close" size={20} color="#666" />
                  </Pressable>
                </View>

                {/* Provider Info */}
                <View className="flex-row items-center mb-[6%]">
                  <View className="w-[15%] aspect-square bg-gray-300 rounded-full mr-[4%]">
                    {userData?.profilePhoto ? (
                      <Image
                        source={{ uri: userData.profilePhoto }}
                        style={{ width: scale(38), height: verticalScale(38) }}
                        className="rounded-full mr-[3%]"
                      />
                    ) : (
                      <View
                        style={{ width: scale(38), height: verticalScale(38) }}
                        className="rounded-full mr-[3%] bg-gray-300 items-center justify-center"
                      >
                        <Ionicons name="person" size={24} color="#6B7280" />
                      </View>
                    )}
                  </View>
                  <View>
                    <Text className="text-base font-semibold text-gray-800">
                      {userData?.name || "N/A"}
                    </Text>
                    {/* <Text className="text-sm text-gray-500">Electrician</Text> */}
                  </View>
                </View>

                {/* Incident Type */}
                {/* <View className="mb-[6%]">
                  <Text className="text-sm font-medium text-gray-700 mb-[2%]">
                    Incident Type
                  </Text>
                  <TouchableOpacity className="border border-gray-300 rounded-lg p-[4%] flex-row justify-between items-center">
                    <Text
                      className={`text-base ${selectedIncident ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {selectedIncident || "Select here..."}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View> */}
                <IncidentTypeDropdown
                  selectedIncident={selectedIncident}
                  setSelectedIncident={setSelectedIncident}
                />

                {/* Additional Notes */}
                <View className="mb-[8%]">
                  <Text className="text-sm font-medium text-gray-700 mb-[2%]">
                    Additional Notes:
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-[4%] text-base text-gray-800 min-h-[25%]"
                    multiline
                    textAlignVertical="top"
                    placeholder="Didn't completed the job as he was promise to!"
                    placeholderTextColor="#9CA3AF"
                    value={additionalNotes}
                    onChangeText={setAdditionalNotes}
                  />
                </View>

                {/* Submit Button */}
                <Pressable
                  onPress={handleSubmitReport}
                  className="bg-blue-600 mt-[2%] rounded-lg p-[4%] items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    Submit
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            // Provider Selection
            <View className="p-[5%]">
              {/* Header */}
              <View className="flex-row justify-between items-center mb-[6%]">
                <Text className="text-lg font-semibold text-gray-800">
                  Select Action
                </Text>
                <Pressable
                  onPress={handleCloseModal}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <Ionicons name="close" size={20} color="#666" />
                </Pressable>
              </View>

              {/* Provider Options */}
              <View className="gap-y-[3%]">
                {/* Report Provider */}
                <Pressable
                  onPress={() => handleProviderSelect("report")}
                  className="flex-row items-center p-[4%] rounded-xl bg-gray-50 active:bg-gray-100"
                >
                  <View className="w-[12%] aspect-square bg-gray-200 rounded-lg justify-center items-center mr-[4%]">
                    <Ionicons name="flag-outline" size={20} color="#374151" />
                  </View>
                  <Text className="flex-1 text-base font-medium text-gray-800">
                    Report Provider
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </Pressable>

                {/* Block Provider */}
                {/* <TouchableOpacity
                  onPress={() => handleProviderSelect("block")}
                  className="flex-row items-center p-[4%] rounded-xl bg-gray-50 active:bg-gray-100"
                >
                  <View className="w-[12%] aspect-square bg-gray-200 rounded-lg justify-center items-center mr-[4%]">
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#374151"
                    />
                  </View>
                  <Text className="flex-1 text-base font-medium text-gray-800">
                    Block Provider
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity> */}
              </View>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// Example usage component
export default ReportModal;
