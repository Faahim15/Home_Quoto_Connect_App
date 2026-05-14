import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function PhotoUpload({ images = [], onImagesChange }) {
  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    return {
      camera: cameraPermission.status === "granted",
      gallery: galleryPermission.status === "granted",
    };
  };

  const handleTakePhoto = async () => {
    const permissions = await requestPermissions();

    if (!permissions.camera) {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newImages = [...images, result.assets[0].uri];
      onImagesChange(newImages);
    }
  };

  const handleSelectPhotos = async () => {
    const permissions = await requestPermissions();

    if (!permissions.gallery) {
      Alert.alert(
        "Permission Required",
        "Gallery permission is required to select photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImageUris = result.assets.map((asset) => asset.uri);
      const allImages = [...images, ...newImageUris];
      onImagesChange(allImages);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <View className="mt-[3%]">
      <Text className="font-poppins-400regular text-base text-[#5C5F62] mb-[1.5%]">
        Project Photos
      </Text>

      {/* Action Buttons */}
      <View className="flex-row gap-3 mb-4">
        <Pressable
          onPress={handleTakePhoto}
          className="flex-1 flex-row items-center justify-center bg-white border border-gray-200 rounded-xl py-3 px-4"
        >
          <Ionicons name="camera-outline" size={20} color="#898989" />
          <Text className="ml-2 text-[#898989] font-poppins-400regular">
            Take Photo
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSelectPhotos}
          className="flex-1 flex-row items-center justify-center bg-white border border-gray-200 rounded-xl py-3 px-4"
        >
          <Ionicons name="images-outline" size={20} color="#898989" />
          <Text className="ml-2 text-[#898989] font-poppins-400regular">
            Select Photos
          </Text>
        </Pressable>
      </View>

      {/* Image Grid */}
      {images.length > 0 && (
        <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
          <View className="flex-row mt-[2%] flex-wrap gap-2">
            {images.map((uri, index) => (
              <View key={index} className="relative w-[30%] aspect-square">
                <Image
                  source={{ uri }}
                  className="w-full h-full rounded-lg"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                  style={{
                    elevation: 2,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}
                >
                  <Ionicons name="close" size={16} color="white" />
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <View className="bg-white border border-dashed border-gray-300 rounded-xl py-8 items-center justify-center">
          <Ionicons name="image-outline" size={48} color="#D1D5DB" />
          <Text className="text-gray-400 mt-2 font-poppins-400regular">
            No photos added yet
          </Text>
        </View>
      )}

      {/* Photo Count */}
      {images.length > 0 && (
        <Text className="text-gray-500 text-sm mt-2 font-poppins-400regular">
          {images.length} {images.length === 1 ? "photo" : "photos"} added
        </Text>
      )}
    </View>
  );
}
