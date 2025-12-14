import { View, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import CustomTitle from "../../components/shared/CustomTitle";
import VerifyHeader from "../../components/provider/auth/VerifyHeader";
import ImageSelector from "../../components/shared/imagePicker/ImagePicker";
import LicenceHeader from "../../components/provider/auth/LicenceHeader";
import CustomButton from "../../components/onboarding/CustomButton";
import { useSubmitBackgroundCheckMutation } from "../../../redux/features/apiSlices/user/userApiSlices";

export default function CriminalCheck() {
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);

  const [submitBackgroundCheck, { isLoading }] =
    useSubmitBackgroundCheckMutation();

  const handleSubmit = async () => {
    if (!idFront || !idBack) {
      Alert.alert(
        "Missing Files",
        "Please upload both front and back of your ID."
      );
      return;
    }

    try {
      await submitBackgroundCheck({ idFront, idBack }).unwrap();
      Alert.alert("Success", "Background check submitted successfully!");
      router.push("/provider/auth/validation");
    } catch (error) {
      Alert.alert(
        "Error",
        error?.message || "Failed to submit. Please try again."
      );
    }
  };

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: "6%", paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <CustomTitle />

        <View className="mt-[9%]">
          <VerifyHeader
            title="Criminal Background Check"
            subTitle="To complete your verification, please upload a valid photo ID."
          />
        </View>

        <View className="mt-[8%]">
          <View className="mt-[2%]">
            <LicenceHeader
              title="Please upload the front side of your ID card"
              subtitle="Supported file types: JPG, PNG"
            />
            <View className="flex-1 mt-[2%]">
              <ImageSelector selectedFile={idFront} onFileSelect={setIdFront} />
            </View>
          </View>

          <View className="mt-[2%]">
            <LicenceHeader
              title="Please upload the back side of your ID card"
              subtitle="Supported file types: JPG, PNG"
            />
            <View className="flex-1 mt-[2%]">
              <ImageSelector selectedFile={idBack} onFileSelect={setIdBack} />
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="mb-[20%]">
        <CustomButton
          onPress={handleSubmit}
          title={isLoading ? "Submitting..." : "Continue"}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}
