import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal-v2";
import { Ionicons } from "@expo/vector-icons";

const CountryPickerField = ({ color = "#1F2937" }) => {
  const [countryCode, setCountryCode] = useState("US");
  const [country, setCountry] = useState(null);
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [withFlag, setWithFlag] = useState(true);
  const [withCallingCodeButton, setWithCallingCodeButton] = useState(false);
  const [withAlphaFilter, setWithAlphaFilter] = useState(false);
  const [withCallingCode, setWithCallingCode] = useState(false);
  const [withEmoji, setWithEmoji] = useState(true);
  const [visible, setVisible] = useState(false);

  const { width } = Dimensions.get("window");
  const isTablet = width > 768;

  const onSelect = (selectedCountry) => {
    setCountryCode(selectedCountry.cca2);
    setCountry(selectedCountry);
  };

  return (
    <View className="w-full mt-[3%] bg-white">
      <Text
        style={{ color: color }}
        className=" text-base font-poppins-500medium mb-[3%]"
      >
        Country
      </Text>
      <Pressable
        className={`flex-row items-center justify-between bg-white border border-gray-300 rounded-lg px-[4%] py-[4%] ${
          isTablet ? "px-[6%] py-[4%]" : "px-[4%] py-[3%]"
        } shadow-sm`}
        onPress={() => setVisible(true)}
      >
        <View className="flex-row items-center flex-1">
          {country ? (
            <>
              {/* ✅ Renders actual flag properly */}
              <CountryPicker
                countryCode={country.cca2}
                withFlag
                withEmoji={false}
                withCountryNameButton={false}
                withCallingCode={false}
                withFilter={false}
                onSelect={() => {}}
                visible={false}
                containerButtonStyle={{
                  marginRight: isTablet ? 12 : 8,
                }}
              />
              <View className="flex-1">
                <Text className="font-medium text-[#000] text-base">
                  {country.name}
                </Text>
                <Text
                  className={`text-[#898989] ${isTablet ? "text-base" : "text-sm"}`}
                >
                  +{country.callingCode[0]}
                </Text>
              </View>
            </>
          ) : (
            <Text
              className={`text-[#898989] ${isTablet ? "text-lg" : "text-base"}`}
            >
              Select Country
            </Text>
          )}
        </View>
        <Ionicons
          name="chevron-down"
          size={isTablet ? 24 : 20}
          color="#6B7280"
        />
      </Pressable>

      <CountryPicker
        countryCode={countryCode}
        withFilter={true}
        withFlag={withFlag}
        withCountryNameButton={withCountryNameButton}
        withAlphaFilter={withAlphaFilter}
        withCallingCode={withCallingCode}
        withEmoji={false} // ⛔ Don't use emojis
        onSelect={onSelect}
        visible={visible}
        onClose={() => setVisible(false)}
        modalProps={{
          animationType: "slide",
        }}
        flatListProps={{
          keyExtractor: (item) => item.cca2,
        }}
        containerButtonStyle={{
          display: "none",
        }}
        theme={{
          backgroundColor: "#ffffff",
          onBackgroundTextColor: "#000000",
          fontSize: isTablet ? 18 : 16,
          filterPlaceholderTextColor: "#5C5F62",
          activeOpacity: 0.7,
        }}
      />
    </View>
  );
};

export default CountryPickerField;
