// LicenceUpload.jsx
import { View, Alert, Platform } from "react-native";
import { useState } from "react";
import CustomTitle from "../../components/shared/CustomTitle";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VerifyHeader from "../../components/provider/auth/VerifyHeader";
import Uploader from "../../components/provider/auth/Uploader";
import LicenceHeader from "../../components/provider/auth/LicenceHeader";
import ImageSelector from "../../components/shared/imagePicker/ImagePicker";
import CustomButton from "../../components/onboarding/CustomButton";
import { router } from "expo-router";
import { useUploadVerificationDocumentsMutation } from "../../../redux/features/apiSlices/auth/authApiSlices";
import { toast } from "sonner-native";

/* ================= HELPERS ================= */

const sanitizeFileName = (name = "file") =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_");

const normalizeUri = (uri) =>
  Platform.OS === "android" ? uri : uri.replace("file://", "");

/* ================= COMPONENT ================= */

export default function LicenceUpload() {
  const [businessLicense, setBusinessLicense] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const value = await AsyncStorage.getItem("token");
        if (value !== null) {
          setToken(value);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  const [uploadDocuments, { isLoading }] =
    useUploadVerificationDocumentsMutation();

  const handleContinue = async () => {
    // Validation
    if (!businessLicense) {
      toast.error("Please upload your business license.");
      return;
    }

    if (!certificate) {
      toast.error("Please upload your ID photo.");
      return;
    }

    try {
      const formData = new FormData();

      // Business License (PDF)
      formData.append("businessLicense", {
        uri: normalizeUri(businessLicense.uri),
        type: "application/pdf",
        name: sanitizeFileName(businessLicense.name || "business_license.pdf"),
      });

      // Certificate / ID Image
      formData.append("certificate", {
        uri: normalizeUri(certificate.uri),
        type: "image/jpeg",
        name: sanitizeFileName(certificate.name || "certificate.jpg"),
      });

      await uploadDocuments(formData).unwrap();

      toast.success("Documents uploaded successfully.");

      router.replace("/provider/auth/criminalCheck");
    } catch (error) {
      toast.error(
        error?.message || "Failed to upload documents. Please try again.",
      );
    }
  };

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <View>
        <CustomTitle />
      </View>

      <View className="mx-[6%]">
        <View className="mt-[9%]">
          <VerifyHeader
            title="Upload Your License and ID"
            subTitle="Please upload your valid business license and a clear photo of your government-issued ID."
          />
        </View>

        <Uploader
          title="Upload a valid government-issued ID."
          subtitle="Supported File Types: PDF (Max size: 5MB)"
          selectedFile={businessLicense}
          onFileSelect={setBusinessLicense}
        />

        <View className="mt-[8%]">
          <LicenceHeader
            title="Upload a clear photo of yourself"
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
