import { Text, View, KeyboardAvoidingView, Platform } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import LocationDetails from "../components/tabs/jobs/LocationDetails";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import { router } from "expo-router";

export default function LocationDetailsScreen() {
  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 50}
      >
        <View className="flex-1  px-[6%] bg-[#F9F9F9]">
          <View className="">
            <CustomTitle title="Post a Job" />
          </View>
          <View className="">
            <LocationDetails />
          </View>
          <View className="flex-1 mt-[90%] ">
            <CustomButton
              title="Continue"
              onPress={() => router.push("/services/bookingSummary")}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
