import { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";

const ServiceDocumentUpload = ({
  title,
  content,
  backgroundColor = "#F9F9F9",
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
      console.error("Document picker error:", error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert("No file selected", "Please select a PDF file first");
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("license", {
        uri: selectedFile.uri,
        type: selectedFile.mimeType || "application/pdf",
        name: selectedFile.name,
      });

      // Replace with your actual upload endpoint
      const response = await fetch("YOUR_UPLOAD_ENDPOINT", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        Alert.alert("Success", "License uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      Alert.alert("Upload Error", "Failed to upload the file");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <View className="w-full ">
      {/* Header */}
      {title && (
        <Text className=" font-poppins-400regular text-base  text-[#1F2937] ">
          {title}
        </Text>
      )}

      {/* Alternative: Simple File Row (like your image) */}
      <View className="w-full mt-[2%]">
        <View
          style={{ backgroundColor: backgroundColor }}
          className="w-full   border border-[#DCDCDC] rounded-lg"
        >
          <Pressable
            onPress={selectedFile ? null : pickDocument}
            className="flex-row items-center justify-between px-[3%] py-[4%]"
            activeOpacity={0.7}
          >
            <View
              style={{ backgroundColor: backgroundColor }}
              className="flex-row items-center flex-1"
            >
              <View
                style={{ width: scale(32), height: verticalScale(32) }}
                className=" bg-red-100 rounded items-center justify-center mr-3"
              >
                <Ionicons name="document-text" size={16} color="#DC2626" />
              </View>
              <Text className="font-poppins-400regular text-[#6B7280] flex-1">
                {selectedFile ? selectedFile.name : content}
              </Text>
            </View>

            <Pressable
              onPress={selectedFile ? removeFile : pickDocument}
              activeOpacity={0.7}
            >
              <Text
                className={`text-base font-poppins-500medium ${selectedFile ? "text-red-600" : "text-[#319FCA]"} `}
              >
                {selectedFile ? "Remove" : "Change"}
              </Text>
            </Pressable>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ServiceDocumentUpload;
