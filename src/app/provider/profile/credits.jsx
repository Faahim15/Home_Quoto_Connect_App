import { View, Text, ActivityIndicator } from "react-native";
import CustomTitle from "../../components/shared/services/CustomTitle";
import AddMoreButton from "../../components/provider/profile/AddMoreButton";
import RecentActivity from "../../components/provider/profile/Recent";
import { router } from "expo-router";
import { useUserProfileQuery } from "../../../redux/features/apiSlices/user/userApiSlices";
import { useGetCreditsActivityQuery } from "../../../redux/features/apiSlices/payment/paymentApiSlice";

export default function CreditsDetailScreen() {
  const { data, isLoading, error } = useUserProfileQuery();

  const creditsHandler = () => {
    router.push("/provider/profile/buyCredits");
  };

  // --------------------------------------------------
  // ⭐ Loading UI
  // --------------------------------------------------
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9]">
        <ActivityIndicator size="large" color="#5C5F62" />
        <Text className="mt-3 text-[#5C5F62] font-poppins-500medium text-base">
          Loading credits...
        </Text>
      </View>
    );
  }

  // --------------------------------------------------
  // ⭐ Error UI
  // --------------------------------------------------
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f9f9f9] px-6">
        <Text className="text-red-500 text-lg font-poppins-500medium">
          Failed to load credits
        </Text>
        <Text className="mt-1 text-center text-[#5C5F62] font-poppins-400regular">
          Please try again later.
        </Text>
      </View>
    );
  }
  const credit = data?.data?.user?.credits;
  return (
    <View className="flex-1 bg-[#f9f9f9] px-[6%] ">
      <View>
        <CustomTitle title="Credits" />
      </View>

      <View className="mt-[7%] justify-center items-center ">
        <Text className="font-poppins-bold text-base text-black">
          You Have {credit || 0} Credits Left
        </Text>

        <View className="w-full">
          <AddMoreButton onPress={creditsHandler} title="Buy more Credits" />
        </View>
      </View>

      <RecentActivity />
    </View>
  );
}
