import { View, Text } from "react-native";
import CustomTitle from "../../components/shared/CustomTitle";
import VerifyHeader from "../../components/provider/auth/VerifyHeader";
import Uploader from "../../components/provider/auth/Uploader";
import ImageSelector from "../../components/shared/imagePicker/ImagePicker";
import LicenceHeader from "../../components/provider/auth/LicenceHeader";
import CustomButton from "../../components/onboarding/CustomButton";
import { router } from "expo-router";
export default function criminalCheck() {
  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View className="mx-[6%]">
        <CustomTitle />
        <View className="mt-[9%]">
          <VerifyHeader
            title="Criminal Background Check"
            subTitle="To complete your verification, please upload a valid photo ID and signed consent form."
          />
        </View>

        <Uploader
          title="Upload ID (front and back if applicable)"
          subtitle="Accepted Document Types: Passport, National ID"
        />

        <View className="mt-[8%]">
          <LicenceHeader
            title="Upload Signed Consent Form"
            subtitle="Supported file types: PDF, JPG, PNG"
          />
          <View className="flex-1 mt-[2%]">
            <ImageSelector />
          </View>
        </View>
      </View>
      <CustomButton
        onPress={() => router.push("/provider/auth/validation")}
        title="Continue"
      />
    </View>
  );
}
