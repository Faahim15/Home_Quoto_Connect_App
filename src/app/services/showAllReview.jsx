import { ActivityIndicator, Text, View } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import AllReviews from "../components/tabs/home/services/provider/details/AllReviews";
import { useLocalSearchParams } from "expo-router";
import { useGetProviderProfileDetailsQuery } from "../../redux/features/apiSlices/user/createJobSlices";

export default function AllReviewScreen() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error } = useGetProviderProfileDetailsQuery(id);
  // console.log("this from allreviewpage:", id);
  // Add loading state check
  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#18649F" />
        <Text className="font-poppins-500medium text-sm text-[#565656] mt-4">
          Loading all reviews...
        </Text>
      </View>
    );
  }

  return (
    <>
      <View>
        <CustomTitle title="Reviews" withSafeTop={true} />
      </View>
      <View className="flex-1 bg-[#f9f9f9] px-[6%] ">
        <View>
          <AllReviews allReview={data?.data} />
        </View>
      </View>
    </>
  );
}
