import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import UserSelectionButtons from "../components/onboarding/ChoiceButton";
import XStyle from "../util/styles";
import ServiceCards from "../components/shared/services/ServiceCards";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  useGetActiveJobsQuery,
  useGetTodaysJobsQuery,
} from "../../redux/features/apiSlices/user/createJobSlices";

export default function OnboardingHomeScreen() {
  const {
    data: todaysJobs,
    isLoading: todaysJobsLoading,
    refetch: refetchTodaysJobs,
    error: todaysJobsError,
  } = useGetTodaysJobsQuery();

  const {
    data: activeJobs,
    isLoading: activeJobsLoading,
    refetch: refetchActiveJobs,
    error: activeJobsError,
  } = useGetActiveJobsQuery();

  // ********** Pull to Refresh **********
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchTodaysJobs(), refetchActiveJobs()]);
    } finally {
      setRefreshing(false);
    }
  };

  if (todaysJobsLoading || activeJobsLoading) {
    return (
      <View className="flex-1 bg-[#F9FAFB] justify-center items-center">
        <ActivityIndicator size="large" color="#175994" />
        <Text className="mt-2 text-[#565656] font-poppins-500medium">
          Loading...
        </Text>
      </View>
    );
  }

  if (todaysJobsError || activeJobsError) {
    return (
      <View className="flex-1 bg-[#F9FAFB] justify-center items-center px-6">
        <Text className="text-lg text-red-500 font-poppins-500medium">
          Unable to Load Data
        </Text>
        <Text className="text-sm text-[#6B7280] text-center mt-2 font-poppins-400regular">
          Please check your connections and try again.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 border border-[#EF4444] rounded-md px-6 py-3"
        >
          <Text className="font-poppins-500medium text-[#EF4444] text-base text-center">
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9FAFB] ">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header section */}

        <View className="justify-center mx-[6%] mt-[1%] ">
          <View className="flex-row justify-between ">
            <Text className="font-poppins-bold text-base">
              Welcome to Quoto!
            </Text>

            <View
              style={{ width: scale(30), height: verticalScale(30) }}
              className="rounded-full items-center justify-center border border-[#175994] "
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#175994"
              />
            </View>
          </View>
          <Text className="text-[#4D4D4D] font-poppins-400regular text-justify w-[80%] text-xs ">
            Connecting homeowners with trusted local pros - fast, simple, and
            reliable
          </Text>
        </View>

        {/* Header section ends here  */}

        {/* Today's Jobs section starts here */}
        <Text className="font-poppins-semiBold text-base text-[#6B7280] mt-[6%] mx-[6%] ">
          Today's Jobs
        </Text>

        <ServiceCards
          jobs={todaysJobs?.data?.jobs || []}
          showPrice
          // showAddress
          whichJob="todaysJob"
        />

        {/* Today's Jobs ends here */}

        {/* Active Jobs section */}
        <Text className=" mt-[3%] font-poppins-semiBold text-base text-[#6B7280] mx-[6%] ">
          Active Jobs
        </Text>

        <ServiceCards
          jobs={activeJobs?.data?.jobs || []}
          showPrice
          // showAddress
          whichJob="active job"
        />
      </ScrollView>
      {/* User Selection section starts here */}
      <View
        style={[XStyle.lightShadow, XStyle.borderStyle]}
        className=" mt-[2%] justify-center items-center border border-[#D4E0EB] px-[6%] py-[5%]"
      >
        <View className="flex-row gap-[4%]">
          <UserSelectionButtons
            onPress={() => {
              router.push("/signIn");
            }}
            title="Join as Client"
          />
          <UserSelectionButtons
            title="Join as Provider"
            onPress={() => router.push("/provider/auth/signIn")}
            backgroundColor="#fff"
            textColor="#175994"
          />
        </View>

        {/* back to onboardingButton */}

        <View className="">
          <Pressable
            onPress={() => {
              router.replace("/onboarding/welcome");
            }}
            style={{
              width: scale(280),
              height: scale(42),
            }}
            className="mt-[4%] justify-center items-center border border-[#EF4444] rounded-md "
          >
            <Text className="font-poppins-500medium text-[#EF4444] text-base text-center">
              Back to onboarding
            </Text>
          </Pressable>
        </View>
        {/* User Selection section starts here */}
      </View>
    </View>
  );
}
