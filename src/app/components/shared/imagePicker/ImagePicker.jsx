// ImageSelector.jsx
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

export default function ImageSelector({ selectedFile, onFileSelect }) {
  const handleUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your photo library."
        );
        return;
      }

      Alert.alert("Upload a clear photo", "Choose your upload method", [
        {
          text: "Photo Library",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
              allowsMultipleSelection: false,
            });

            if (!result.canceled && result.assets.length > 0) {
              onFileSelect({
                name: result.assets[0].fileName || "image.jpg",
                uri: result.assets[0].uri,
                type: result.assets[0].type || "image/jpeg",
              });
            }
          },
        },
        {
          text: "Camera",
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
              onFileSelect({
                name: "camera_photo.jpg",
                uri: result.assets[0].uri,
                type: "image/jpeg",
              });
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick file. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="w-full">
        <View className="bg-[#f9f9f9]">
          <TouchableOpacity
            onPress={handleUpload}
            className="bg-[#f9f9f9] border border-[#DCDCDC] rounded-lg active:bg-blue-50/50"
            activeOpacity={0.7}
          >
            {selectedFile ? (
              <View className="flex-row py-[5%] px-[3%] justify-between items-center">
                <View
                  style={{ width: scale(122), height: verticalScale(55) }}
                  className="flex-row  gap-[4%]"
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={26}
                    color="#10b981"
                    className="mb-[0%]"
                  />
                  <Text className="text-base pt-[1%] font-poppins-500medium text-[#6B7280]">
                    {selectedFile.name}
                  </Text>
                </View>

                <Text className="text-base pt-[1%] font-poppins-500medium text-[#319FCA] text-center">
                  Tap to change file
                </Text>
              </View>
            ) : (
              <View className="flex-row px-[3%] gap-[5%] py-[3%] w-full items-center">
                <View className="w-[32px] h-[32px] bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons
                    name="cloud-upload-outline"
                    size={16}
                    color="#3b82f6"
                  />
                </View>
                <Text className="font-poppins-400regular text-[#6B7280] text-center">
                  Click to upload
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
