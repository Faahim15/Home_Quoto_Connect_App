import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Image,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "sonner-native";
import CustomTitle from "../../components/shared/CustomTitle";
import VerifyHeader from "../../components/provider/auth/VerifyHeader";
import CustomButton from "../../components/onboarding/CustomButton";
import { clearCriminalCheckData } from "../../../redux/features/provider/criminalCheckSlice";
import { useSubmitBackgroundCheckMutation } from "../../../redux/features/apiSlices/auth/authApiSlices";
import { verticalScale } from "../../components/adaptive/Adaptiveness";

// Helper functions
const sanitizeFileName = (name = "file") =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_");

const normalizeUri = (uri) =>
  Platform.OS === "android" ? uri : uri?.replace("file://", "");

export default function BackgroundCheckFinalize() {
  const dispatch = useDispatch();
  const criminalCheckState = useSelector((state) => state.criminalCheck);
  const { paymentIntentId } = useLocalSearchParams();
  const [submitBackgroundCheck, { isLoading }] =
    useSubmitBackgroundCheckMutation();

  const idFront = criminalCheckState?.idFront;
  const idBack = criminalCheckState?.idBack;

  const handleFinalize = async () => {
    try {
      // Validation
      const formData = new FormData();
      formData.append("idFront", {
        uri: idFront?.uri,
        type: idFront?.type,
        name: sanitizeFileName(idFront?.name),
      });

      formData.append("idBack", {
        uri: idBack?.uri,
        type: idBack?.type,
        name: sanitizeFileName(idBack?.name),
      });

      formData.append("paymentIntentId", paymentIntentId?.toString());

      const res = await submitBackgroundCheck(formData);

      if (res?.success || res?.data?._id) {
        toast.success("Background check submitted successfully!");
        dispatch(clearCriminalCheckData());
        router.push("/provider/auth/validation");
      } else {
        toast.success(
          res?.message || "Background check submitted successfully!",
        );
      }
    } catch (err) {
      console.log("Submission error:", err?.message);

      let errorMessage = "Failed to submit background check";

      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.status === 402) {
        errorMessage = "Payment not completed. Please verify your payment.";
      } else if (err?.status === 403) {
        errorMessage = "Only provider accounts can submit background checks.";
      } else if (err?.status === 404) {
        errorMessage = "User profile not found.";
      } else if (err?.status === 400) {
        errorMessage =
          "Invalid submission. Please ensure all files are valid JPG or PNG.";
      }

      toast.error(errorMessage);
    }
  };

  if (!idFront?.uri || !idBack?.uri || !paymentIntentId) {
    return (
      <View className="flex-1 bg-[#F9F9F9]">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: "6%",
            paddingBottom: verticalScale(80),
          }}
          showsVerticalScrollIndicator={false}
        >
          <CustomTitle />
          <View className="mt-[5%]">
            <VerifyHeader
              title="Missing Documents"
              subTitle="Please upload all required documents"
            />
          </View>
          <View className="mt-10 bg-red-50 border border-red-300 rounded-lg p-4">
            <Text className="text-red-900 font-poppins-semiBold mb-2">
              ⚠️ Missing Information
            </Text>
            <Text className="text-red-800 text-sm">
              {!idFront?.uri && "• ID Front image is missing\n"}
              {!idBack?.uri && "• ID Back image is missing\n"}
              {!paymentIntentId && "• Payment information is missing"}
            </Text>
          </View>
        </ScrollView>
        <View className="border-t py-[3%] border-gray-200">
          <CustomButton
            onPress={() => router.back()}
            title="Go Back to Upload"
            bg="#635BFF"
            marginTop={0}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: "6%",
          paddingBottom: verticalScale(80),
        }}
        showsVerticalScrollIndicator={false}
      >
        <CustomTitle />
        <View className="mt-[5%]">
          <VerifyHeader
            title="Complete Background Check"
            subTitle="Review your documents before submitting"
          />
        </View>

        <View className="mt-[3%]">
          <Text className="text-base font-poppins-semiBold text-gray-900 mb-[3%]">
            Your Documents
          </Text>

          {/* ID Front Preview */}
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-sm font-poppins-semiBold text-gray-700 mb-2">
              ID Front
            </Text>
            {idFront?.uri ? (
              <Image
                source={{ uri: normalizeUri(idFront.uri) }}
                className="w-full h-48 rounded-lg bg-gray-200"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-48 rounded-lg bg-gray-200 justify-center items-center">
                <Text className="text-gray-500">No image selected</Text>
              </View>
            )}
          </View>

          {/* ID Back Preview */}
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-sm font-poppins-semiBold text-gray-700 mb-2">
              ID Back
            </Text>
            {idBack?.uri ? (
              <Image
                source={{ uri: normalizeUri(idBack.uri) }}
                className="w-full h-48 rounded-lg bg-gray-200"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-48 rounded-lg bg-gray-200 justify-center items-center">
                <Text className="text-gray-500">No image selected</Text>
              </View>
            )}
          </View>
        </View>

        <View className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <Text className="text-sm font-poppins-semiBold text-red-900 mb-2">
            ⚠️ Important: Submit Your Documents
          </Text>
          <Text className="text-xs font-poppins text-red-800 leading-5">
            You must click the "Submit Background Check" button below to
            complete your verification. If you don't submit now, your background
            check verification will fail and you won't be able to proceed.
          </Text>
        </View>

        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <Text className="text-xs font-poppins text-blue-900">
            ℹ️ Your documents will be verified within 24-48 hours. You'll
            receive an email once the verification is complete.
          </Text>
        </View>

        {isLoading && (
          <View className="mt-4 flex-row items-center justify-center gap-2">
            <ActivityIndicator size="small" color="#635BFF" />
            <Text className="text-gray-600">Submitting your documents...</Text>
          </View>
        )}
      </ScrollView>

      <View className="border-t py-[3%] border-gray-200">
        <CustomButton
          onPress={handleFinalize}
          title={isLoading ? "Submitting..." : "Submit Background Check"}
          disabled={isLoading}
          marginTop={0}
        />
      </View>
      <Toast />
    </View>
  );
}
