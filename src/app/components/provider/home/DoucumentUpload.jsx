// ServiceDocumentUpload.jsx
import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

const ServiceDocumentUpload = ({
  title,
  content,
  backgroundColor = "#F9F9F9",
  selectedFile,
  onFileSelect,
}) => {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        onFileSelect(file);
        console.log("Selected file:", file);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
      console.error("Document picker error:", error);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <View className="w-full">
      {title && (
        <Text className="font-poppins-400regular text-base text-[#1F2937]">
          {title}
        </Text>
      )}

      <View className="w-full mt-[2%]">
        <View
          style={{ backgroundColor: backgroundColor }}
          className="w-full border border-[#DCDCDC] rounded-lg"
        >
          <TouchableOpacity
            onPress={selectedFile ? null : pickDocument}
            className="flex-row items-center justify-between px-[3%] py-[3%]"
            activeOpacity={0.7}
          >
            <View
              style={{ backgroundColor: backgroundColor }}
              className="flex-row items-center flex-1"
            >
              <View
                style={{ width: scale(32), height: verticalScale(32) }}
                className="bg-red-100 rounded items-center justify-center mr-3"
              >
                <Ionicons name="document-text" size={16} color="#DC2626" />
              </View>
              <Text className="font-poppins-400regular text-[#6B7280] flex-1">
                {selectedFile ? selectedFile.name : content}
              </Text>
            </View>

            <TouchableOpacity
              onPress={selectedFile ? removeFile : pickDocument}
              activeOpacity={0.7}
            >
              <Text
                className={`text-base font-poppins-500medium ${
                  selectedFile ? "text-red-600" : "text-[#319FCA]"
                }`}
              >
                {selectedFile ? "Remove" : "Change"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ServiceDocumentUpload;
