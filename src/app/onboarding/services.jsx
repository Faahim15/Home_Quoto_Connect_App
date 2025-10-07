import { View, Image } from "react-native";
import CustomHeader from "../components/onboarding/CustomHeader";
import CustomButton from "../components/onboarding/CustomButton";
import Indicators from "../components/onboarding/Indicators";
import { router } from "expo-router";
export default function FindServiceScreen() {
  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <Indicators activeIndex={2} />
      <View className=" relative justify-center items-center ">
        {/* Background Image */}
        <Image
          source={require("../../../assets/images/onboarding/bgImage.png")}
          className="w-[79%] h-[66%] rounded-3xl "
          resizeMode="cover"
        />

        {/* Onboarding Image on top */}
        <Image
          source={require("../../../assets/images/onboarding/onboarding3.png")}
          className="absolute w-[60%] h-[80%] top-[3%] " // Adjust positioning as needed
          resizeMode="contain"
        />
      </View>

      <CustomHeader
        title="Find Services"
        subtitle="From plumbing and electrical to repairs and renovations - everything you need, in one place."
      />
      <CustomButton
        onPress={() => router.push("/onboarding/loginChoice")}
        title="Next"
      />
      <CustomButton
        title="Skip to home"
        backgroundColor="#fff"
        color="#175994"
        marginTop={16}
        onPress={() => router.push("/onboarding/home")}
      />
    </View>
  );
}
