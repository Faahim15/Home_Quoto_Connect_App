import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { useState } from "react";

const countries = [
  {
    code: "+1",
    flag: "🇨🇦",
    name: "Canada",
    maxLength: 12,
    format: "XXX XXX XXXX",
  },
  {
    code: "+1",
    flag: "🇺🇸",
    name: "United States",
    maxLength: 12,
    format: "XXX XXX XXXX",
  },
  {
    code: "+44",
    flag: "🇬🇧",
    name: "United Kingdom",
    maxLength: 13,
    format: "XXXX XXX XXXX",
  },
  {
    code: "+33",
    flag: "🇫🇷",
    name: "France",
    maxLength: 12,
    format: "X XX XX XX XX",
  },
  {
    code: "+49",
    flag: "🇩🇪",
    name: "Germany",
    maxLength: 13,
    format: "XXX XXXXXXXX",
  },
  {
    code: "+39",
    flag: "🇮🇹",
    name: "Italy",
    maxLength: 12,
    format: "XXX XXX XXXX",
  },
  {
    code: "+34",
    flag: "🇪🇸",
    name: "Spain",
    maxLength: 11,
    format: "XXX XX XX XX",
  },
  {
    code: "+81",
    flag: "🇯🇵",
    name: "Japan",
    maxLength: 13,
    format: "XX XXXX XXXX",
  },
  {
    code: "+82",
    flag: "🇰🇷",
    name: "South Korea",
    maxLength: 13,
    format: "XX XXXX XXXX",
  },
  {
    code: "+61",
    flag: "🇦🇺",
    name: "Australia",
    maxLength: 12,
    format: "XXX XXX XXX",
  },
  {
    code: "+64",
    flag: "🇳🇿",
    name: "New Zealand",
    maxLength: 11,
    format: "XX XXX XXXX",
  },
  {
    code: "+31",
    flag: "🇳🇱",
    name: "Netherlands",
    maxLength: 11,
    format: "XX XXX XXXX",
  },
  {
    code: "+32",
    flag: "🇧🇪",
    name: "Belgium",
    maxLength: 11,
    format: "XXX XX XX XX",
  },
  {
    code: "+47",
    flag: "🇳🇴",
    name: "Norway",
    maxLength: 10,
    format: "XXX XX XXX",
  },
  {
    code: "+46",
    flag: "🇸🇪",
    name: "Sweden",
    maxLength: 11,
    format: "XX XXX XX XX",
  },
  {
    code: "+45",
    flag: "🇩🇰",
    name: "Denmark",
    maxLength: 10,
    format: "XX XX XX XX",
  },
  {
    code: "+48",
    flag: "🇵🇱",
    name: "Poland",
    maxLength: 11,
    format: "XXX XXX XXX",
  },
  {
    code: "+351",
    flag: "🇵🇹",
    name: "Portugal",
    maxLength: 11,
    format: "XXX XXX XXX",
  },
];

export default function PhoneInput({ onChangeText, error, value }) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const limited = cleaned.slice(0, 10);

    let formatted = limited;
    if (limited.length > 3) {
      formatted = limited.slice(0, 3) + " " + limited.slice(3);
    }
    if (limited.length > 6) {
      formatted =
        limited.slice(0, 3) +
        " " +
        limited.slice(3, 6) +
        " " +
        limited.slice(6);
    }

    return formatted;
  };

  const handlePhoneChange = (text) => {
    const formatted = formatPhoneNumber(text);
    if (onChangeText) {
      onChangeText(formatted);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  return (
    <View className="mb-[2%]">
      <View className="w-full">
        <Text className="font-poppins-400regular text-base text-[#000] mb-[2%]">
          Phone number
        </Text>

        <View className="flex-row bg-[#f9f9f9] items-center border border-[#DCDCDC] rounded-md px-[3%] py-[5%]">
          {/* Country Selector */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="flex-row items-center mr-2"
          >
            <Text className="text-2xl">{selectedCountry.flag}</Text>
          </TouchableOpacity>

          {/* Separator */}
          <View className="h-6 w-[1px] bg-gray-300 mr-3" />

          {/* Country Code */}
          <Text className="text-gray-700 text-base mr-2">
            {selectedCountry.code}
          </Text>

          {/* Phone Input */}
          <TextInput
            className="flex-1 text-gray-900 text-base"
            value={value}
            onChangeText={handlePhoneChange}
            placeholder={selectedCountry.format}
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={selectedCountry.maxLength}
          />
        </View>

        {/* Error Message */}
        {error && (
          <Text className="text-red-700 font-poppins text-center mt-1">
            {error}
          </Text>
        )}
      </View>

      {/* Country Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-[70%]">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-center">
                Select Country
              </Text>
            </View>

            <FlatList
              data={countries}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCountrySelect(item)}
                  className="flex-row items-center p-4 border-b border-gray-100"
                >
                  <Text className="text-2xl mr-3">{item.flag}</Text>
                  <Text className="flex-1 text-base text-gray-900">
                    {item.name}
                  </Text>
                  <Text className="text-base text-gray-600">{item.code}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="p-4 bg-gray-100"
            >
              <Text className="text-center text-base font-semibold text-gray-700">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
