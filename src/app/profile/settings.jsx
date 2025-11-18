import { Text, View, TouchableOpacity } from "react-native";
import CustomTitle from "../components/shared/services/CustomTitle";
import AccountOptionItem from "../components/tabs/profile/AccountOptions";
import { useState } from "react";
import XStyle from "../util/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DeleteAccountModal from "../components/tabs/profile/DeleteModal";
import { useDeleteAccountMutation } from "../../redux/features/apiSlices/user/userApiSlices";
import Toast from "react-native-toast-message";

export default function AccountSettingScreen() {
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const [modalVisible, setModalVisible] = useState(false);

  function deleteAccountHandler() {
    setModalVisible(true);
  }

  const handleDeleteAccount = async (password) => {
    try {
      const result = await deleteAccount({ password }).unwrap();

      console.log("Account deleted successfully:", result);

      Toast.show({
        type: "success",
        text1: "Account Deleted Successfully",
        text2: "Your account has been permanently deleted.",
        visibilityTime: 3000,
      });

      setModalVisible(false);
      router.replace("onboarding/loginChoice");
    } catch (err) {
      console.log("Error deleting account:", err);

      // Show toast for incorrect password or other errors
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.message || "Something went wrong. Please try again.",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View className="flex-1 px-[6%] bg-[#F9F9F9]">
      <View>
        <CustomTitle title="Account Settings" />
      </View>
      <View className="mt-[6%]">
        <AccountOptionItem
          onPress={() => router.push("/profile/changePassword")}
          title="Change Password"
        />
        <AccountOptionItem
          onPress={() => router.push("/profile/terms")}
          title="Terms of Services"
        />
        <AccountOptionItem
          onPress={() => router.push("/profile/privacy")}
          title="Privacy Policy"
        />
        <AccountOptionItem
          onPress={() => router.push("/profile/about")}
          title="About us"
        />

        <TouchableOpacity
          onPress={deleteAccountHandler}
          style={XStyle.shadowBox}
          className="flex-row mt-[3%] rounded-2xl border border-[#fff] justify-between"
        >
          <Text
            style={{ color: "#D7263D" }}
            className="font-poppins-400regular text-sm"
          >
            Delete Account
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#333333" />
        </TouchableOpacity>

        <DeleteAccountModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onDelete={handleDeleteAccount}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}
