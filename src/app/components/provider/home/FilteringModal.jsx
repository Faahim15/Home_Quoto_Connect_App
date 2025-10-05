import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import ServiceTypes from "../../tabs/home/ServiceTypes";

import PriceSlider from "../../tabs/home/PriceInput";
import ApplyFilterButton from "../../tabs/home/FilterButton";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import CanadianLocationDropdown from "./CanLocationDrop";
import ServiceTypeDropdown from "../../tabs/home/modal/ServiceTypeDropdown";

export default function FilterModal({ visible, onClose }) {
  const [location, setLocation] = useState(null);

  const handleLocationSelect = (locationData) => {
    setLocation(locationData);
    console.log("Selected location:", locationData);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
              className="w-[90%] max-h-[80%]"
            >
              <View className="bg-[#fff] border border-[#dcdcdc] rounded-lg">
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ flexGrow: 1 }}
                  bounces={false}
                >
                  <View className="px-[6%] mt-[3%]">
                    {/* <ServiceTypes /> */}
                    <ServiceTypeDropdown />
                    {/* Close Icon */}
                    <TouchableOpacity
                      onPress={onClose}
                      className="absolute top-3 right-3 z-10"
                    >
                      <Ionicons name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <View className="px-[6%] pb-[6%]">
                    <View className="mt-[3%]">
                      <CanadianLocationDropdown
                        onLocationSelect={handleLocationSelect}
                      />
                    </View>

                    <View className="mt-[10%]">
                      <PriceSlider />
                      <ApplyFilterButton onClose={onClose} />
                    </View>
                  </View>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
