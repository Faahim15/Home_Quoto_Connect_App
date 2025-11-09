import { Image, Text, View, TouchableOpacity } from "react-native";
import ProfileMenuItem from "../components/tabs/profile/ProfileMenuItem";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import ConfirmationModal from "../components/tabs/profile/ConfirmationModal";
import { useState } from "react";
import LogoutItem from "../components/tabs/profile/LogoutItem";
import { router } from "expo-router";
import {
  editProfile,
  notification,
  accountSettings,
  support,
} from "../../../assets/svg/profile";
import { useLogoutUserMutation } from "../../redux/features/apiSlices/auth/authApiSlices";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function UserProfileScreen() {
  function logoutHanlder() {
    setModalVisible(true);
  }
  const [modalVisible, setModalVisible] = useState(false);
  const [logout, { isLoading }] = useLogoutUserMutation();
  const handleYes = async () => {
    try {
      // Call logout API
      await logout().unwrap();

      // Remove token from AsyncStorage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");

      setModalVisible(false);

      // Show success toast
      Toast.show({
        type: "success",
        text1: "Logged Out Successfully",
        text2: "See you soon! 👋",
        position: "top",
        visibilityTime: 2000,
      });

      // Navigate after a short delay to show toast
      setTimeout(() => {
        router.replace("/onboarding/loginChoice");
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      setModalVisible(false);

      // Show error toast
      Toast.show({
        type: "error",
        text1: "Logout Failed",
        text2: "Something went wrong. Please try again.",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  const handleNo = () => {
    setModalVisible(false);
  };
  return (
    <View className="flex-1 px-[5%] bg-[#F9F9F9]">
      <View className="">
        <Text className="font-poppins-semiBold text-center text-lg text-[#1F2937] ">
          My Profile
        </Text>
      </View>
      <View className=" mt-[2%] items-center justify-center ">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
          }}
          style={{ width: scale(96), height: verticalScale(96) }}
          className="rounded-full border-2 border-white " // Add dimensions
          resizeMode="cover"
        />
        <Text className="font-poppins-semiBold text-lg text-[#565656] ">
          Minnie
        </Text>
      </View>
      <View className="mt-[3%]">
        <ProfileMenuItem
          iconName={editProfile}
          label="Edit Profile"
          onPress={() => router.push("/profile/editProfile")}
        />
        <ProfileMenuItem
          iconName={notification}
          label="Notification"
          onPress={() => router.push("/profile/notification")}
        />
        <ProfileMenuItem
          iconName={accountSettings}
          onPress={() => router.push("/profile/settings")}
          label="Account Settings"
        />
        <ProfileMenuItem
          iconName={support}
          onPress={() => router.push("/profile/support")}
          label="Help & support "
        />

        <LogoutItem onPress={logoutHanlder} />

        <ConfirmationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="Do you want to log out?"
          yesText={isLoading ? "Logging out..." : "Yes"}
          noText="No"
          onYes={handleYes}
          onNo={handleNo}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}
