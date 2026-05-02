import { View, Text } from "react-native";
import CustomTitle from "../../components/shared/CustomTitle";
import { scale, verticalScale } from "../../components/adaptive/Adaptiveness";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../../components/onboarding/CustomButton";
import { router } from "expo-router";
import VerifyHeader from "../../components/provider/auth/VerifyHeader";

export default function licenceVerify() {
  return (
    <View className="flex-1 bg-[#F9F9F9]"> 
       <View >
          <CustomTitle />
        </View>
      <View className="flex-1 mx-[6%]">
     
        <View className="flex-1 justify-center items-center mt-[11.20%]">
          <View
            style={{ width: scale(64), height: verticalScale(64) }}
            className="rounded-full mb-[4%] justify-center items-center bg-[#4ADE80]"
          >
            <Ionicons name="shield-checkmark-outline" size={24} color="#fff" />
          </View>

          <VerifyHeader
            title="Complete Your Verification"
            subTitle=" To ensure trust and safety on our platform, we require all service
              providers to complete verification before accepting jobs."
          />
          <CustomButton
            onPress={() => router.push("/provider/auth/licenceUpload")}
            marginTop={64}
            title="Verify Now"
          />
          <Text className="font-poppins mt-[4%] text-center text-sm text-[#4B5563]">
            Complete your verification now to be able to start accepting jobs.
          </Text>
          <CustomButton
            onPress={() => router.replace("/provider/home")}
            color="#175994"
            backgroundColor="#fff"
            marginTop={15}
            title="Skip for Now"
          />
        </View>
      </View>
    </View>
  );
}
