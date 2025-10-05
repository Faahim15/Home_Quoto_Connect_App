import { View, Text, ScrollView } from "react-native";

import CustomTitle from "../../components/shared/CustomTitle";
import LottieView from "lottie-react-native";
import { scale, verticalScale } from "../../components/adaptive/Adaptiveness";
import { router } from "expo-router";
import CustomButton from "../../components/tabs/home/services/provider/details/CustomButton";
import BackgroundCheckScreen from "../../components/provider/auth/BackgroundCheck";
export default function Validation() {
  return (
    <ScrollView>
      <View className="flex-1 bg-[#f9f9f9]">
        <View className="flex-1 px-[6%] ">
          <CustomTitle />
          <View className="flex-1 justify-center items-center">
            <View className=" items-center  ">
              <LottieView
                source={require("../../../../assets/animations/success.json")}
                autoPlay
                loop={true}
                style={{ width: scale(200), height: verticalScale(150) }}
              />
            </View>
            <View>
              <Text className="font-poppins-bold  text-center text-2xl  text-[#111827] ">
                Verification Successful
              </Text>
              <Text className="font-poppins-400regular text-center pt-[2%]  text-base text-[#4B5563] ">
                Congratulations! Your profile has been verified and you are now
                ready to accept jobs.
              </Text>
            </View>
          </View>
        </View>
        {/* <View className="pb-[40%] mx-[6%]">
        <CustomButton
          onPress={() => router.replace("/provider/home")}
          title="Start Accepting Jobs"
        />
      </View> */}
        <BackgroundCheckScreen />
      </View>
    </ScrollView>
  );
}
