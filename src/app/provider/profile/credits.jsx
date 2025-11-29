import { View, Text } from "react-native";
import CustomTitle from "../../components/shared/services/CustomTitle";
import AddMoreButton from "../../components/provider/profile/AddMoreButton";
import RecentActivity from "../../components/provider/profile/Recent";
import { router, useLocalSearchParams } from "expo-router";
import { useUserProfileQuery } from "../../../redux/features/apiSlices/user/userApiSlices";
export default function CreditsDetailScreen() {
  //   const totalCredits = route?.params.selectedPlanId;

  const { data, isLoading, error } = useUserProfileQuery();
  const { selectedPlanId } = useLocalSearchParams();
  const creditsHandler = () => {
    // navigation.navigate("BuyCreditScreen");
    router.push("/provider/profile/buyCredits");
  };
  const planId = +selectedPlanId || 0;

  return (
    <View className="flex-1 bg-[#f9f9f9] px-[6%] ">
      <View>
        <CustomTitle title="Credits" />
      </View>
      <View className="mt-[7%] justify-center items-center ">
        <Text className="font-poppins-bold text-base text-black">
          You Have {planId === 25 ? 25 : planId + 25} Credits Left
        </Text>
        <View className="w-full">
          <AddMoreButton onPress={creditsHandler} title="Buy more Credits" />
        </View>
      </View>
      <RecentActivity />
    </View>
  );
}
