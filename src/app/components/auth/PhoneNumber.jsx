import { View, Text, TextInput } from "react-native";

export default function PhoneInput({ onChangeText, error, value }) {
  const formatPhoneNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "");

    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);

    // Format with spaces: XXX XXX XXXX
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
    // Call the parent's onChangeText with the formatted value
    if (onChangeText) {
      onChangeText(formatted);
    }
  };

  return (
    <View className="mb-[4%]">
      <View className="w-full">
        <Text className="font-poppins-400regular text-base text-[#000] mb-[2%]">
          Phone number
        </Text>

        <View className="flex-row bg-[#f9f9f9] items-center border border-[#DCDCDC] rounded-md px-[3%] py-[3%]">
          {/* Canadian Flag */}
          <View className="mr-2">
            <Text className="text-2xl">🇨🇦</Text>
          </View>

          {/* Separator */}
          <View className="h-6 w-[1px] bg-gray-300 mr-3" />

          {/* Country Code */}
          <Text className="text-gray-700 text-base mr-2">+1</Text>

          {/* Phone Input */}
          <TextInput
            className="flex-1 text-gray-900 text-base"
            value={value} // Use the value prop from parent (Redux state)
            onChangeText={handlePhoneChange}
            placeholder="XXX XXX XXXX"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            maxLength={12}
          />
        </View>

        {/* Error Message */}
        {error && (
          <Text className="text-red-700 font-poppins text-center mt-1">
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}
