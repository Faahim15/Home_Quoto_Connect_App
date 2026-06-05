import { Text, View, Pressable } from "react-native";
import CustomTitle from "../components/shared/CustomTitle";
import AccountOptionItem from "../components/tabs/profile/AccountOptions";
import { useState } from "react";
import XStyle from "../util/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DeleteAccountModal from "../components/tabs/profile/DeleteModal";
import { useDeleteAccountMutation } from "../../redux/features/apiSlices/user/userApiSlices";
import { toast } from "sonner-native";

export default function AccountSettingScreen() {
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const [modalVisible, setModalVisible] = useState(false);

  function deleteAccountHandler() {
    setModalVisible(true);
  }

  const handleDeleteAccount = async (password) => {
    try {
      const result = await deleteAccount({ password }).unwrap();

      toast.success("Your account has been permanently deleted.");

      setModalVisible(false);
      router.replace("onboarding/loginChoice");
    } catch (err) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-[#F9F9F9]">
      <CustomTitle title="Account Settings" withSafeTop={true} />
      <View className="mt-[6%] px-[6%]">
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

        <Pressable
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
        </Pressable>

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
