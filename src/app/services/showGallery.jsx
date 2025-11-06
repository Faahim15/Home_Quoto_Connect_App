import { useLocalSearchParams } from "expo-router";
import CustomTitle from "../components/shared/CustomTitle";
import ViewAllGallery from "../components/tabs/home/services/provider/details/ViewAllGallery";
import { ActivityIndicator, View } from "react-native";
import { useGetProviderDetailsQuery } from "../../redux/features/apiSlices/user/createJobSlices";
export default function ViewAllGalleryScreen() {
  const { id } = useLocalSearchParams();
  // console.log("this is from view all gallery:", id);
  const { data, isLoading, error } = useGetProviderDetailsQuery(id);

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
  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="flex-1 mx-[6%]">
        <CustomTitle title="Gallery" />
        <View className="mt-[3%]">
          <ViewAllGallery allImages={allImages} />
        </View>
      </View>
    </View>
  );
}
