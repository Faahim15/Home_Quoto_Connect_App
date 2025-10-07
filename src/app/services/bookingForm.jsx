import { View, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import LocationPicker from "../components/auth/LocationPicker";
import CustomButton from "../components/tabs/home/services/provider/details/CustomButton";
import TimePicker from "../components/tabs/home/services/provider/TimePicker";
import ButtonGroup from "../components/tabs/home/services/provider/ButtonGroup";
import InstructionField from "../components/tabs/home/services/provider/InstructionField";
import PriceSlider from "../components/tabs/home/PriceInput";
import RequestButton from "../components/tabs/home/services/provider/RequestButton";
import { router } from "expo-router";
import TextField from "../components/tabs/jobs/TextField";

export default function BookProviderScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F9F9F9]"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-[6%] bg-[#F9F9F9]">
          <CustomTitle title="Book Jackson" />
          <View className="mt-[3%]">
            <TextField />
          </View>
          <View className="mt-[4%]">
            <LocationPicker />
          </View>

          {/* Time Picker Section */}
          <TimePicker />

          {/* Button Selection */}
          <ButtonGroup />

          <View className="mt-[3%]">
            <PriceSlider />
            <RequestButton />
          </View>

          <InstructionField />

          {/* Continue Button */}
          <View className="mt-[3%] mb-[5%]">
            <CustomButton
              onPress={() => router.push("/services/bookLocation")}
              title="Continue"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
