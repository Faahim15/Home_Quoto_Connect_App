import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  FlatList, // ✅ Import FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import CustomTitle from "../components/shared/CustomTitle";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  addPhoto,
  removePhoto as removePhotoFromStore,
  setJobField,
  resetJobPost, // ✅ Import resetJobPost
} from "../../redux/features/jobPost/jobPostSlice";
import { useGetSingleJobQuery } from "../../redux/features/apiSlices/user/createJobSlices";

export default function UploadPhotos() {
  const dispatch = useDispatch();
  const { jobId } = useLocalSearchParams();
  const photos = useSelector((state) => state.jobPost.photos);
  const [isInitialized, setIsInitialized] = useState(false);

  const { data, isLoading, error, refetch } = useGetSingleJobQuery(jobId, {
    skip: !jobId,
  });

  const job = data?.data?.job;

  // ✅ RESET JOB DATA: User যখন এই page আসবে, তখনই reset হবে
  useEffect(() => {
    console.log("🔄 Resetting job data when user enters UploadPhotos...");
    dispatch(resetJobPost());
  }, [dispatch]);

  // ✅ Initialize photos from job data when editing (AFTER reset)
  useEffect(() => {
    if (job?.photos && job.photos.length > 0 && jobId && !isInitialized) {
      console.log("🔄 Loading existing photos from API...");

      // Transform job photos to match Redux format
      const initialPhotos = job.photos.map((photo) => ({
        id: photo._id || photo.id,
        uri: photo.url,
        public_id: photo.public_id,
        isExisting: true, // Existing photos from server
      }));

      // Set ONLY photos in Redux (other fields are already reset)
      dispatch(setJobField({ field: "photos", value: initialPhotos }));
      setIsInitialized(true);

      console.log("✅ Existing photos loaded:", initialPhotos.length);
    }
  }, [job, jobId, isInitialized, dispatch]);

  // 📸 Show camera or gallery options
  const showImageOptions = () => {
    Alert.alert("Select Photo", "Choose how you want to add a photo", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // 📷 Take photo using camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera permission is required to take photos"
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
      // ✅ Add new photo to existing photos
      dispatch(
        addPhoto({
          id: uniqueId,
          uri: result.assets[0].uri,
          isExisting: false, // New photo
        })
      );
    }
  };

  // 🖼️ Pick photo from gallery
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // ✅ Add new photos to existing array
      result.assets.forEach((asset) => {
        const uniqueId =
          Date.now().toString() + Math.random().toString(36).substring(2, 9);
        dispatch(
          addPhoto({
            id: uniqueId,
            uri: asset.uri,
            isExisting: false, // New photo
          })
        );
      });
    }
  };

  // 🗑️ Remove photo from Redux store
  const handleRemovePhoto = (photoId) => {
    dispatch(removePhotoFromStore(photoId));
  };

  // ➡️ Continue button
  const handleContinue = () => {
    if (photos.length === 0) {
      Alert.alert("Please add at least one photo to continue");
      return;
    }

    console.log("📸 Final photo summary:", photos);

    router.push({
      pathname: "/jobs/jobForm",
      params: jobId ? { jobId } : {},
    });
  };

  // ✅ Render each photo item for FlatList
  const renderPhotoItem = ({ item: photo }) => (
    <View className="relative mr-3">
      <Image
        source={{ uri: photo.uri }}
        className="w-24 h-24 bg-gray-100 rounded-lg"
        style={{ aspectRatio: 1 }}
      />
      {/* Show badge for existing photos */}
      {photo.isExisting && (
        <View className="absolute top-1 left-1 bg-green-500 rounded-full px-2 py-1">
          <Text className="text-white text-xs font-bold">Saved</Text>
        </View>
      )}
      {/* Show badge for new photos */}
      {!photo.isExisting && (
        <View className="absolute top-1 left-1 bg-blue-500 rounded-full px-2 py-1">
          <Text className="text-white text-xs font-bold">New</Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => handleRemovePhoto(photo.id)}
        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
      >
        <Ionicons name="close" size={12} color="#666" />
      </TouchableOpacity>
    </View>
  );

  // Loading state
  if (isLoading && jobId) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9F9] justify-center items-center">
        <ActivityIndicator size="large" color="#319FCA" />
        <Text className="text-gray-600 text-base mt-4 font-medium">
          Loading photos...
        </Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && jobId) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9F9F9] justify-center items-center px-[6%]">
        <Text className="text-gray-800 text-xl font-bold mb-2">
          Unable to Load Photos
        </Text>
        <Text className="text-gray-500 text-base text-center mb-6">
          We couldn't fetch the job photos. Please try again.
        </Text>
        <CustomButton title="Retry" onPress={() => refetch()} />
      </SafeAreaView>
    );
  }

  // ✅ Count existing vs new photos
  const existingPhotosCount = photos.filter((photo) => photo.isExisting).length;
  const newPhotosCount = photos.filter((photo) => !photo.isExisting).length;

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9F9]">
      {/* Header */}
      {/* <View className="px-[6%]">
        <CustomTitle title={jobId ? "Edit Job Photos" : "Post a job"} />
      </View> */}

      <ScrollView className="flex-1 px-[5%] py-[5%]">
        {/* Title */}
        <Text className="text-base font-poppins-semiBold text-[#6B7280] mb-[5%]">
          Add Some Photos of the Job
        </Text>

        {/* Upload Area */}
        <TouchableOpacity
          onPress={showImageOptions}
          className="w-full h-[40%] bg-gray-100 rounded-lg flex items-center justify-center mb-[5%] border-2 border-dashed border-gray-300"
        >
          <View className="bg-blue-500 rounded-full p-3 mb-[2%]">
            <Ionicons name="camera" size={24} color="white" />
          </View>
          <Text className="text-gray-600 text-center">Tap to add photos</Text>
        </TouchableOpacity>

        {/* ✅ Photo Grid with Horizontal FlatList */}
        {photos.length > 0 && (
          <View className="mb-[5%]">
            <Text className="text-base font-poppins-semiBold text-[#6B7280] mb-3">
              Your Photos ({photos.length})
            </Text>
            <FlatList
              data={photos}
              renderItem={renderPhotoItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </View>
        )}

        {/* Info */}
        <View className="flex-row items-center mb-[8%]">
          <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
          <Text className="font-poppins-400regular text-sm text-[#1F2937] ml-[2%]">
            Add photos of the job so workers get more quotes!
          </Text>
        </View>

        {/* Photo count with breakdown */}
        {photos.length > 0 && (
          <View className="bg-blue-50 p-3 rounded-lg mb-[5%]">
            <Text className="text-blue-800 font-poppins-600semiBold text-center mb-1">
              {photos.length} photo{photos.length !== 1 ? "s" : ""} total
            </Text>
            {jobId && (existingPhotosCount > 0 || newPhotosCount > 0) && (
              <View className="flex-row justify-center items-center gap-2">
                {existingPhotosCount > 0 && (
                  <Text className="text-green-700 text-xs font-poppins-500medium">
                    {existingPhotosCount} saved
                  </Text>
                )}
                {existingPhotosCount > 0 && newPhotosCount > 0 && (
                  <Text className="text-gray-500">•</Text>
                )}
                {newPhotosCount > 0 && (
                  <Text className="text-blue-700 text-xs font-poppins-500medium">
                    {newPhotosCount} new
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Helper text for editing */}
        {jobId && photos.length > 0 && (
          <View className="bg-gray-50 p-3 rounded-lg mb-[5%] border border-gray-200">
            <View className="flex-row items-start">
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#6B7280"
              />
              <Text className="text-gray-600 text-xs ml-2 flex-1">
                <Text className="font-poppins-600semiBold">Green badges</Text>{" "}
                show photos already saved on the server.{"\n"}
                <Text className="font-poppins-600semiBold">
                  Blue badges
                </Text>{" "}
                show new photos that will be uploaded.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View className="px-[5%] pb-[10%] pt-[3%]">
        <CustomButton
          onPress={handleContinue}
          title={jobId ? "Update & Continue" : "Continue"}
        />
      </View>
    </SafeAreaView>
  );
}
