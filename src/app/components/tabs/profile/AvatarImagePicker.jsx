import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useUpdateProfilePhotoMutation } from "../../../../redux/features/apiSlices/user/userApiSlices";
import * as FileSystem from "expo-file-system/legacy";

const AvatarImagePicker = ({ photo }) => {
  const [avatar, setAvatar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [updateProfilePhoto, { isLoading }] = useUpdateProfilePhotoMutation();

  // Set initial avatar from photo prop
  useEffect(() => {
    if (photo?.url) {
      setAvatar(photo.url);
    }
  }, [photo]);

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert(
          "Permissions Required",
          "Sorry, we need camera and photo library permissions to make this work!",
        );
        return false;
      }
    }
    return true;
  };

  // Upload image to server
  const uploadImage = async (imageUri) => {
    try {
      // Extract filename from URI
      const filename = imageUri.split("/").pop();

      // Get file extension
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? match[1].toLowerCase() : "jpeg";

      // ── base64 read ──
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: "base64", // ← EncodingType.Base64 এর বদলে string literal
      });

      const formData = new FormData();

      formData.append("profilePhoto", {
        uri: `data:image/${fileType};base64,${base64}`,
        name: filename,
        type: `image/${fileType}`,
      });

      const response = await updateProfilePhoto(formData).unwrap();

      if (response?.success) {
        Alert.alert("Success", "Profile photo updated successfully!");
        if (response?.data?.profilePhoto?.url) {
          setAvatar(response.data.profilePhoto.url);
        } else if (response?.data?.url) {
          setAvatar(response.data.url);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        "Upload Failed",
        error?.data?.message ||
          error?.message ||
          "Failed to update profile photo. Please try again.",
      );
      if (photo?.url) {
        setAvatar(photo.url);
      }
    }
  };
  // Pick image from gallery
  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setAvatar(selectedImage); // Show preview immediately
      setModalVisible(false);
      await uploadImage(selectedImage); // Upload to server
    }
  };

  // Take photo with camera
  const takePhotoWithCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const capturedImage = result.assets[0].uri;
      setAvatar(capturedImage); // Show preview immediately
      setModalVisible(false);
      await uploadImage(capturedImage); // Upload to server
    }
  };

  return (
    <View className="items-center justify-center px-[4%]">
      {/* Avatar Display */}
      <Pressable
        onPress={() => setModalVisible(true)}
        className="relative"
        disabled={isLoading}
      >
        <View className="w-[25%] aspect-square rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100">
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-gray-200">
              <Ionicons
                name="person-circle-outline"
                size={48} // adjust size to fit your container
                color="#555" // tweak color for contrast
              />
            </View>
          )}
          {/* Loading Overlay */}
          {isLoading && (
            <View className="absolute inset-0 bg-black/50 items-center justify-center">
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
        </View>

        {/* Edit Icon */}
        <View className="absolute -bottom-[2%] -right-[2%] w-[10%] aspect-square bg-[#0054A5] rounded-full items-center justify-center border-2 border-white">
          <Ionicons name="camera" size={16} color="white" />
        </View>
      </Pressable>

      {/* Modal for Image Selection */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="absolute top-[16%] mx-[10%] w-[80%] bg-white">
          <View className="bg-white rounded-t-3xl p-[5%] pb-[8%]">
            {/* Modal Header */}
            <View className="items-center mb-[5%]">
              <View className="w-[12%] h-[0.3%] bg-gray-300 rounded-full mb-[3%]" />
              <Text className="text-lg font-semibold text-gray-800">
                Choose Profile Photo
              </Text>
            </View>

            {/* Options */}
            <View className="gap-[5%]">
              {/* Camera Option */}
              <Pressable
                onPress={takePhotoWithCamera}
                className="flex-row items-center p-[3%] bg-gray-50 rounded-xl"
                disabled={isLoading}
              >
                <View className="w-[12%] aspect-square bg-blue-100 rounded-full items-center justify-center mr-[3%]">
                  <Ionicons name="camera" size={24} color="#3B82F6" />
                </View>
                <View>
                  <Text className="text-base font-medium text-gray-800">
                    Take Photo
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Use your camera to take a new photo
                  </Text>
                </View>
              </Pressable>

              {/* Gallery Option */}
              <Pressable
                onPress={pickImageFromGallery}
                className="flex-row items-center p-[3%] bg-gray-50 rounded-xl"
                disabled={isLoading}
              >
                <View className="w-[12%] aspect-square bg-green-100 rounded-full items-center justify-center mr-[3%]">
                  <Ionicons name="images" size={24} color="#10B981" />
                </View>
                <View>
                  <Text className="text-base font-medium text-gray-800">
                    Choose from Gallery
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Select a photo from your photo library
                  </Text>
                </View>
              </Pressable>

              {/* Cancel Button */}
              <Pressable
                onPress={() => setModalVisible(false)}
                className="mt-[3%] p-[4%] bg-gray-100 rounded-xl"
                disabled={isLoading}
              >
                <Text className="text-center text-base font-medium text-gray-600">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AvatarImagePicker;
