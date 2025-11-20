// LicenceUpload.jsx
import { View, Alert } from "react-native";
import { useState } from "react";
import CustomTitle from "../../components/shared/CustomTitle";
import VerifyHeader from "../../components/provider/auth/VerifyHeader";
import Uploader from "../../components/provider/auth/Uploader";
import LicenceHeader from "../../components/provider/auth/LicenceHeader";
import ImageSelector from "../../components/shared/imagePicker/ImagePicker";
import CustomButton from "../../components/onboarding/CustomButton";
import { router } from "expo-router";
import { useUploadVerificationDocumentsMutation } from "../../../redux/features/apiSlices/auth/authApiSlices";

export default function LicenceUpload() {
  const [businessLicense, setBusinessLicense] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [uploadDocuments, { isLoading }] =
    useUploadVerificationDocumentsMutation();

  console.log("certificate", certificate);

  const handleContinue = async () => {
    // Validation
    if (!businessLicense) {
      Alert.alert("Required", "Please upload your business license");
      return;
    }
    if (!certificate) {
      Alert.alert("Required", "Please upload your ID photo");
      return;
    }

    try {
      // Create FormData
      const formData = new FormData();

      formData.append("businessLicense", {
        uri: businessLicense.uri,
        type: businessLicense.type || "application/pdf",
        name: businessLicense.name,
      });

      formData.append("certificate", {
        uri: certificate.uri,
        type: certificate.type || "image/jpeg",
        name: certificate.name,
      });

      // Upload
      const result = await uploadDocuments(formData).unwrap();

      console.log("result", result);

      Alert.alert("Success", "Documents uploaded successfully", [
        {
          text: "OK",
          onPress: () => router.push("/provider/auth/criminalCheck"),
        },
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload documents. Please try again.");
    }
  };

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
          selectedFile={businessLicense}
          onFileSelect={setBusinessLicense}
        />

        <View className="mt-[8%]">
          <LicenceHeader
            title="Upload a clear photo"
            subtitle="Supported File Types: JPG, JPEG, PNG"
          />
          <View className="flex-1 mt-[2%]">
            <ImageSelector
              selectedFile={certificate}
              onFileSelect={setCertificate}
            />
          </View>
        </View>
      </View>
      <CustomButton
        onPress={handleContinue}
        title={isLoading ? "Uploading..." : "Continue"}
        disabled={isLoading}
      />
    </View>
  );
}
