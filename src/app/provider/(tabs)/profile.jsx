import { Text, View, ScrollView } from "react-native";
import ContractorDetails from "../../components/provider/profile/ProviderDetails";
import ProfileMenuItem from "../../components/tabs/profile/ProfileMenuItem";
import LogoutItem from "../../components/tabs/profile/LogoutItem";
import { useState } from "react";
import ConfirmationModal from "../../components/tabs/profile/ConfirmationModal";
import { router } from "expo-router";
import Toast from "react-native-toast-message"; // Add this import
import {
  myEarnings,
  editProfile,
  services,
  projectGallery,
  verification,
  payment,
  subscription,
  buyCredits,
  notification,
  accountSettings,
  support,
} from "../../../../assets/svg/profile";
import { useLogoutUserMutation } from "../../../redux/features/apiSlices/auth/authApiSlices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ContractorProfileScreen() {
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
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-[6%] bg-[#F9F9F9]">
          {/* Contractor Details */}
          <ContractorDetails />
          {/* Profile information */}
          <View className="mt-[3%]">
            <View>
              <Text className="font-poppins-500medium text-lg text-[#565656] ">
                Profile information
              </Text>
              <View className="mt-[3%]">
                <ProfileMenuItem
                  iconName={myEarnings}
                  label="My Earnings"
                  onPress={() => router.push("provider/profile/myEarnings")}
                />
                <ProfileMenuItem
                  iconName={editProfile}
                  label="Edit Profile"
                  onPress={() => router.push("/profile/editProfile")}
                />
                <ProfileMenuItem
                  iconName={services}
                  label="Services"
                  onPress={() => router.push("provider/profile/services")}
                />
                <ProfileMenuItem
                  iconName={projectGallery}
                  onPress={() => router.push("provider/profile/projectGallery")}
                  label="Project Gallery"
                />
                <ProfileMenuItem
                  iconName={verification}
                  onPress={() => router.push("provider/profile/verification")}
                  label="Verification"
                />
              </View>
            </View>

            <View>
              <Text className="font-poppins-500medium text-lg text-[#565656] ">
                Subscription & payments
              </Text>
              <View className="mt-[3%]">
                <ProfileMenuItem
                  iconName={payment}
                  label="Payment method"
                  onPress={() => router.push("provider/profile/payment")}
                />
                <ProfileMenuItem
                  iconName={subscription}
                  label="Subscription"
                  onPress={() => router.push("provider/profile/subscription")}
                />
                <ProfileMenuItem
                  iconName={buyCredits}
                  label="Buy Credits"
                  onPress={() => router.push("provider/profile/credits")}
                />
              </View>
            </View>

            <View>
              <Text className="font-poppins-500medium text-lg text-[#565656] ">
                General Preferences
              </Text>
              <View className="mt-[3%]">
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
          </View>
        </View>
      </ScrollView>
      {/* Toast component - Add this at the end */}
      <Toast />
    </>
  );
}
