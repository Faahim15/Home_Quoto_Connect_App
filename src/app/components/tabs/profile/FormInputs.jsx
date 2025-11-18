import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const ProfileFormInputs = () => {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [country, setCountry] = useState("Mexico");
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState({
    code: "+1",
    flag: "🇨🇦",
    country: "Canada",
  });

  const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);

  // Sample countries data
  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Argentina",
    "Australia",
    "Austria",
    "Bangladesh",
    "Belgium",
    "Brazil",
    "Canada",
    "China",
    "Denmark",
    "Egypt",
    "France",
    "Germany",
    "India",
    "Indonesia",
    "Italy",
    "Japan",
    "Mexico",
    "Netherlands",
    "Norway",
    "Pakistan",
    "Russia",
    "Saudi Arabia",
    "South Korea",
    "Spain",
    "Sweden",
    "Switzerland",
    "Turkey",
    "United Kingdom",
    "United States",
    "Vietnam",
  ];

  // Sample country codes
  const countryCodes = [
    { code: "+1", flag: "🇺🇸", country: "United States" },
    { code: "+1", flag: "🇨🇦", country: "Canada" },
  ];

  // Handle date change
  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
      const formattedDate = selected.toLocaleDateString("en-GB");
      setDateOfBirth(formattedDate);
    }
  };

  return (
    <View className="">
      {/* Date of Birth */}
      <View className=" mt-[1.5%]">
        <Text className="font-poppins-400regular text-base text-[#5C5F62] ">
          Date of Birth
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="flex-row mt-[1.5%] items-center justify-between bg-white border border-gray-200 rounded-xl px-[4%] py-[4%]"
        >
          <Text
            className={`text-base ${dateOfBirth ? "text-[#898989]" : "text-gray-400"}`}
          >
            {dateOfBirth || "28/11/2005"}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#898989" />
        </TouchableOpacity>
      </View>

      {/* Country */}
      {/* <View className="mt-[1.5%]">
        <Text className="font-poppins-400regular text-base text-[#5C5F62] ">
          Country
        </Text>
        <TouchableOpacity
          onPress={() => setShowCountryPicker(true)}
          className="flex-row mt-[1.5%] items-center justify-between bg-white border border-gray-200 rounded-xl px-[4%] py-[4%]"
        >
          <Text className="text-base text-[#6B7280]">{country}</Text>
          <Ionicons name="chevron-down" size={20} color="#565656" />
        </TouchableOpacity>
      </View> */}

      {/* Phone Number */}
      <View className="mt-[1.5%]">
        <Text className="font-poppins-400regular text-base text-[#5C5F62]">
          Phone number
        </Text>
        <View className="flex-row mt-[1.5%]  bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Country Code Selector */}
          <TouchableOpacity
            onPress={() => setShowCountryCodePicker(true)}
            className="flex-row items-center px-[3%] py-[4%] border-r border-gray-200"
          >
            <Text className="text-base mr-[1%]">
              {selectedCountryCode.flag}
            </Text>
            <Text className="text-base font-poppins-400regular text-[#898989] mr-[1%]">
              {selectedCountryCode.code}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Phone Input */}
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+1 416-123-4567"
            keyboardType="phone-pad"
            className="flex-1 px-[3%] py-[4%] text-base text-black"
            placeholderTextColor="#898989"
          />
        </View>
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View className=" ">
          <View className="bg-white bo mx-[5%] mt-[40%]  rounded-t-3xl max-h-[70%]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-[6%] py-[4%] border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-800">
                Select Country
              </Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Countries List */}
            <ScrollView className="px-[6%]">
              {countries.map((countryName, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setCountry(countryName);
                    setShowCountryPicker(false);
                  }}
                  className="py-[3%] border-b border-gray-100"
                >
                  <Text className="text-base text-gray-800">{countryName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Country Code Picker Modal */}
      <Modal
        visible={showCountryCodePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCountryCodePicker(false)}
      >
        <View className="  mx-[0%] mt-[40%]  bg-white bg-opacity-50">
          <View className="bg-white rounded-t-3xl ">
            {/* Header */}
            <View className="flex-row items-center justify-between px-[6%] py-[4%] border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-800">
                Select Country Code
              </Text>
              <TouchableOpacity onPress={() => setShowCountryCodePicker(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Country Codes List */}
            <ScrollView className="px-[6%]">
              {countryCodes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedCountryCode(item);
                    setShowCountryCodePicker(false);
                  }}
                  className="flex-row items-center py-[3%] border-b border-gray-100"
                >
                  <Text className="text-xl mr-[3%]">{item.flag}</Text>
                  <Text className="text-base text-gray-800 mr-[2%]">
                    {item.country}
                  </Text>
                  <Text className="text-base text-gray-600">{item.code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileFormInputs;
