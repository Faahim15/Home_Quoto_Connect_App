import { useLocalSearchParams } from "expo-router";
import CustomTitle from "../components/shared/CustomTitle";
import ViewAllGallery from "../components/tabs/home/services/provider/details/ViewAllGallery";
import { ActivityIndicator, Text, View } from "react-native";
import { useGetProviderProfileDetailsQuery } from "../../redux/features/apiSlices/user/createJobSlices";

export default function ViewAllGalleryScreen() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error } = useGetProviderProfileDetailsQuery(id);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#18649F" />
        <Text className="font-poppins-500medium text-sm text-[#565656] mt-4">
          Loading gallery images...
        </Text>
      </View>
    );
  }

  const allImages = data?.data?.portfolio.flatMap((item) => item.images);

  // Check if there are no images
  if (!allImages || allImages.length === 0) {
    return (
      <View className="flex-1 bg-[#F9F9F9]">
        <View className="flex-1 mx-[6%]">
          <CustomTitle title="Gallery" />
          <View className="flex-1 justify-center items-center px-6">
            <Text className="font-poppins-600semibold text-lg text-[#333333] text-center mb-2">
              No Images Available
            </Text>
            <Text className="font-poppins-400regular text-sm text-[#565656] text-center">
              This provider hasn't added any portfolio images yet. Check back
              later for updates.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <CustomTitle title="Gallery" withSafeTop={true} />
      <View className="flex-1 mx-[6%]">
        <View className="mt-[3%]">
          <ViewAllGallery allImages={allImages} />
        </View>
      </View>
    </View>
  );
}
