import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const AvatarImagePicker = () => {
  const [avatar, setAvatar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
          "Sorry, we need camera and photo library permissions to make this work!"
        );
        return false;
      }
    }
    return true;
  };

  // Pick image from gallery
  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "livePhotos"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      setModalVisible(false);
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
      setAvatar(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  return (
    <View className="items-center justify-center px-[4%]">
      {/* Avatar Display */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="relative"
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
              <Image
                source={{
                  uri: "https://avatar.iran.liara.run/public/boy",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        {/* Edit Icon */}
        <View className="absolute -bottom-[2%] -right-[2%] w-[10%] aspect-square bg-[#0054A5] rounded-full items-center justify-center border-2 border-white">
          <Ionicons name="camera" size={16} color="white" />
        </View>
      </TouchableOpacity>

      {/* Modal for Image Selection */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="absolute top-[16%] mx-[10%] w-[80%] bg-white ">
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
              <TouchableOpacity
                onPress={takePhotoWithCamera}
                className="flex-row items-center p-[3%] bg-gray-50 rounded-xl"
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
              </TouchableOpacity>

              {/* Gallery Option */}
              <TouchableOpacity
                onPress={pickImageFromGallery}
                className="flex-row items-center p-[3%] bg-gray-50 rounded-xl"
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
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="mt-[3%] p-[4%] bg-gray-100 rounded-xl"
              >
                <Text className="text-center text-base font-medium text-gray-600">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AvatarImagePicker;
