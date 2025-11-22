import { View, Text, Image, Pressable } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
export default function HomeTopBar({ userData, mode }) {
  const { fullName, location, profilePhoto } = userData;

  const handleEditProfile = () => {
    if (mode === "user") {
      router.push("/profile/editProfile");
    } else {
      router.push("/profile/editProfile");
    }
  };

  return (
    <View className="flex-row   pb-[1%] mx-[6.4%] mt-[2%] gap-[2%]">
      <View>
        <Pressable onPress={handleEditProfile}>
          <Image
            style={{
              width: scale(32),
              height: verticalScale(32),
              borderRadius: scale(16),
            }}
            source={{
              uri:
                profilePhoto?.url || "https://avatar.iran.liara.run/public/boy",
            }}
          />
        </Pressable>
      </View>
      <View className="flex-row w-[90%] justify-between ">
        <View>
          <Text className="font-poppins-bold text-base">Welcome to Quoto!</Text>
          <Text className="font-poppins-400regular text-xs text-[#4D4D4D]">
            {fullName || "N/A"}
          </Text>
          <View className="flex-row gap-[1%] mt-[2%]">
            <Ionicons name="location-outline" size={14} color="#8891AA" />
            <Text className="font-poppins-400regular text-xs text-[#8891AA] ">
              {location?.city || "Dhaka"},{location?.state || "Dhaka"}
            </Text>
          </View>
        </View>
        <View
          style={{ width: scale(30), height: verticalScale(30) }}
          className="rounded-full items-center justify-center border border-[#175994] "
        >
          <Ionicons name="notifications-outline" size={20} color="#175994" />
        </View>
      </View>
    </View>
  );
}
