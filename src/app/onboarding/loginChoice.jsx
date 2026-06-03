import { View, Text, Image } from "react-native";
import CustomButton from "../components/onboarding/CustomButton";
import { router } from "expo-router";
export default function WelcomeToQuotoScreen() {
  return (
    <View className="flex-1 items-center bg-[#F9FAFB]">
      <Text className="mt-[25%] font-poppins-semiBold text-xl text-[#000000] text-center">
        Welcome to QUOTO!
      </Text>
      <View className="mt-[39%] mx-[7%] w-[85%] h-[29%]  justify-center items-center">
        <Image
          source={require("../../../assets/images/onboarding/onboarding4.png")}
          className=" "
          resizeMode="cover"
        />
      </View>
      <View className=" mt-[9%]">
        <Text className="font-poppins-bold text-base text-center text-[#175994] ">
          Join As
        </Text>
      </View>
      <CustomButton
        onPress={() => {
          router.push("/signIn");
        }}
        marginTop={24}
        title="Client"
      />
      <CustomButton
        title="Provider"
        onPress={() => router.push("/provider/auth/signIn")}
        backgroundColor="#fff"
        color="#175994"
        marginTop={16}
      />
    </View>
  );
}
