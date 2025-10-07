import { View, Text } from "react-native";
import CustomTitle from "../../components/shared/CustomTitle";
import VerifyHeader from "../../components/provider/auth/VerifyHeader";
import Uploader from "../../components/provider/auth/Uploader";
import LicenceHeader from "../../components/provider/auth/LicenceHeader";
import ImageSelector from "../../components/shared/imagePicker/ImagePicker";
import CustomButton from "../../components/onboarding/CustomButton";
import { router } from "expo-router";

export default function LicenceUpload() {
  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="mx-[6%]">
        <CustomTitle />
        <View className="mt-[9%]">
          <VerifyHeader
            title="Upload Your License and ID"
            subTitle="Please upload your valid business license and a clear photo of your government-issued ID."
          />
        </View>

        <Uploader
          title="Upload Your Business License"
          subtitle="Supported File Types: PDF, JPG, PNG"
        />

        <View className="mt-[8%]">
          <LicenceHeader
            title="Upload a clear photo"
            subtitle="Supported File Types: JPG, JPEG, PNG"
          />
          <View className="flex-1 mt-[2%]">
            <ImageSelector />
          </View>
        </View>
      </View>
      <CustomButton
        onPress={() => router.push("/provider/auth/criminalCheck")}
        title="Continue"
      />
    </View>
  );
}
