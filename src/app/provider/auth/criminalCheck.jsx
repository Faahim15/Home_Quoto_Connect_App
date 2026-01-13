import { View, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import CustomTitle from "../../components/shared/CustomTitle";
import VerifyHeader from "../../components/provider/auth/VerifyHeader";
import ImageSelector from "../../components/shared/imagePicker/ImagePicker";
import LicenceHeader from "../../components/provider/auth/LicenceHeader";
import CustomButton from "../../components/onboarding/CustomButton";
import {
  setIdFront,
  setIdBack,
} from "../../../redux/features/provider/criminalCheckSlice";

export default function CriminalCheck() {
  const dispatch = useDispatch();
  const { idFront, idBack } = useSelector((state) => state.criminalCheck);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!idFront || !idBack) {
      Alert.alert(
        "Missing Files",
        "Please upload both front and back of your ID."
      );
      return;
    }

    setIsLoading(true);
    // Data is already stored in Redux
    // You can now proceed to the next step
    setTimeout(() => {
      router.push("/provider/auth/backgroundCheck-Payment");
      setIsLoading(false);
    }, 1000);
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
              <ImageSelector
                selectedFile={idFront}
                onFileSelect={(file) => dispatch(setIdFront(file))}
              />
            </View>
          </View>

          <View className="mt-[2%]">
            <LicenceHeader
              title="Please upload the back side of your ID card"
              subtitle="Supported file types: JPG, PNG"
            />
            <View className="flex-1 mt-[2%]">
              <ImageSelector
                selectedFile={idBack}
                onFileSelect={(file) => dispatch(setIdBack(file))}
              />
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
