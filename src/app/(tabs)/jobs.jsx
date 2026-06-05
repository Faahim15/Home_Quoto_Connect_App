import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import CustomTitle from "../components/shared/CustomTitle";
import { router, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  addPhoto,
  removePhoto as removePhotoFromStore,
  resetJobPost,
} from "../../redux/features/jobPost/jobPostSlice";
import { useCallback } from "react";

export default function PostJobScreen() {
  const dispatch = useDispatch();
  const photos = useSelector((state) => state.jobPost.photos);

  //  Reset job data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      dispatch(resetJobPost());

      // Optional: Cleanup function if needed
      return () => {};
    }, [dispatch]),
  );

  const showImageOptions = () => {
    Alert.alert("Select Photo", "Choose how you want to add a photo", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera permission is required to take photos",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uniqueId =
        Date.now().toString() + Math.random().toString(36).substring(2, 9);
      dispatch(addPhoto({ id: uniqueId, uri: result.assets[0].uri }));
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      result.assets.forEach((asset) => {
        const uniqueId =
          Date.now().toString() + Math.random().toString(36).substring(2, 9);
        dispatch(addPhoto({ id: uniqueId, uri: asset.uri }));
      });
    }
  };

  const handleRemovePhoto = (photoId) => {
    dispatch(removePhotoFromStore(photoId));
  };

  const handleContinue = () => {
    if (photos.length === 0) {
      Alert.alert("Please add at least one photo to continue");
      return;
    }
    router.push("/jobs/jobForm");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      <ScrollView className="flex-1 px-[5%] py-[5%]">
        {/* Title */}
        <Text className="text-base font-poppins-semiBold text-[#6B7280] mb-[5%]">
          Add Some Photos of the Job
        </Text>

        {/* Upload Area */}
        <Pressable
          onPress={showImageOptions}
          className="w-full h-[40%] bg-gray-100 rounded-lg flex items-center justify-center mb-[5%] border-2 border-dashed border-gray-300"
        >
          <View className="bg-blue-500 rounded-full p-3 mb-[2%]">
            <Ionicons name="camera" size={24} color="white" />
          </View>
          <Text className="text-gray-600 text-center">Tap to add photos</Text>
        </Pressable>

        {/* Photo Grid */}
        <View className="flex-row flex-wrap justify-between mb-[5%]">
          {photos.map((photo) => (
            <View key={photo.id} className="relative w-[30%] mb-[3%]">
              <Image
                source={{ uri: photo.uri }}
                className="w-full bg-gray-100 rounded-lg"
                style={{ aspectRatio: 1 }}
              />
              <Pressable
                onPress={() => handleRemovePhoto(photo.id)}
                className="absolute top-[5%] right-[5%] bg-white rounded-full p-1 shadow-md"
              >
                <Ionicons name="close" size={16} color="#666" />
              </Pressable>
            </View>
          ))}
        </View>

        {/* Info */}
        <View className="flex-row items-center mb-[8%]">
          <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
          <Text className="font-poppins-400regular text-sm text-[#1F2937] ml-[2%]">
            Add photos of the job so workers get more quotes!
          </Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="px-[5%] pb-[5%] pt-[3%]">
        <CustomButton onPress={handleContinue} title="Continue" />
      </View>
    </SafeAreaView>
  );
}
