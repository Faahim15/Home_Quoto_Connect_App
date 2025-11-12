import { View, Text, ScrollView } from "react-native";
import CustomTitle from "../../components/shared/services/CustomTitle";
import QuoteForm from "../../components/provider/map/QuoteForm";
import { Ionicons } from "@expo/vector-icons";
import BotttomButtons from "../../components/shared/services/buttons/BottomButtons";
import XStyle from "../../util/styles";
import { scale } from "../../components/adaptive/Adaptiveness";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useState } from "react";

export default function UpdateQuoteScreen() {
  console.log("ksdfjklsdflksdfjlsdfkjsdlk");
  const [formData, setFormData] = useState({
    appointment: false,
    quoteDetails: "",
    warrantyDetails: "",
    price: 0,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View className="flex-1  bg-[#F9F9F9]">
      <View className="px-[4%]">
        <CustomTitle title="Update Quote" />
      </View>

      <ScrollView>
        <View className="mt-[3%]">
          <QuoteForm />
        </View>

        <View className="flex-row px-[4%] items-center mb-[2%]">
          <Ionicons name="bulb-outline" size={18} color="#f59e0b" />
          <Text className="font-poppins-400regular  text-justify w-[90%] text-xs text-[#1F2937] ml-[2%]">
            Submitting this quote will cost 5 credits. Your current balance is
            25 credits.
          </Text>
        </View>
      </ScrollView>

      <View
        className="flex-row gap-[6%] h-[14%]   border border-[#D8DCE0] justify-center items-center "
        style={[
          XStyle.shadowBox,
          { borderTopRightRadius: scale(20), borderTopLeftRadius: scale(20) },
        ]}
      >
        <BotttomButtons
          onPress={() => router.back()}
          backgroundColor="#fff"
          color="#EF4444"
          borderColor="#EF4444"
          title="Cancel"
        />
        <BotttomButtons
          onPress={() => {
            Toast.show({
              type: "success",
              text1: "Quote Updated Successfully ✅",
              text2: "Your updated quote has been sent to the customer.",
              position: "bottom",
              visibilityTime: 2500,
            });
            router.replace("/provider/home");
          }}
          backgroundColor="#2583B6"
          color="#fff"
          borderColor="#2583B6"
          title="Send Updated Quote"
          width="full"
        />
      </View>
    </View>
  );
}
