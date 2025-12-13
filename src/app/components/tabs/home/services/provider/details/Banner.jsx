import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { scale, verticalScale } from "../../../../../adaptive/Adaptiveness";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Banner({ providerId, data }) {
  console.log("data", data);
  // Function to handle phone call
  const handleCall = async () => {
    // Check if phone number exists
    if (!data?.phone) {
      Alert.alert("Error", "Phone number not available");
      return;
    }

    // Format phone number (remove spaces, dashes, etc.)
    const phoneNumber = data.phone.replace(/[^0-9+]/g, "");
    const phoneUrl = `tel:${phoneNumber}`;

    try {
      // Check if the device can handle the call
      const supported = await Linking.canOpenURL(phoneUrl);

      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert("Error", "Phone calls are not supported on this device");
      }
    } catch (error) {
      console.error("Error opening dialer:", error);
      Alert.alert("Error", "Failed to open phone dialer");
    }
  };

  return (
    <View>
      <View className="flex-row mt-[3%] mx-[6%] justify-between">
        <View>
          <Text className="font-poppins-semiBold text-2xl text-[#565656]">
            {data?.name?.split(" ").slice(0, 2).join(" ") || "N/A"}
          </Text>
          <Text className="font-poppins-500medium text-base text-[#565656]">
            {data?.designation || "N/A"}
          </Text>
        </View>
        <View className="flex-row w-[50%] justify-between ">
          <View></View>
          <View></View>
          <View></View>

          {/* Call Button */}
          {/* <TouchableOpacity
            onPress={handleCall}
            style={{ width: scale(44), height: verticalScale(44) }}
            className="rounded-full items-center justify-center bg-[#319FCA] "
          >
            <Ionicons name="call-outline" size={24} color="#fff" />
          </TouchableOpacity> */}

          {/* Chat Button */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/chat/displayChat",
                params: { providerId: providerId },
              })
            }
            style={{ width: scale(44), height: verticalScale(44) }}
            className="rounded-full items-center justify-center bg-[#319FCA] "
          >
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
