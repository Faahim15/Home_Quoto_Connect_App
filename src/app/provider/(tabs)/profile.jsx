import {
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from "react-native";
import ContractorDetails from "../../components/provider/profile/ProviderDetails";
import ProfileMenuItem from "../../components/tabs/profile/ProfileMenuItem";
import LogoutItem from "../../components/tabs/profile/LogoutItem";
import { useState, useCallback } from "react";
import ConfirmationModal from "../../components/tabs/profile/ConfirmationModal";
import { router, useFocusEffect } from "expo-router";
import { toast } from "sonner-native";
import {
  myEarnings,
  editProfile,
  services,
  projectGallery,
  payment,
  subscription,
  buyCredits,
  accountSettings,
  support,
} from "../../../../assets/svg/profile";
import { useLogoutUserMutation } from "../../../redux/features/apiSlices/auth/authApiSlices";
import { useUserProfileQuery } from "../../../redux/features/apiSlices/user/userApiSlices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ContractorProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [logout, { isLoading: logoutLoading }] = useLogoutUserMutation();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfileQuery();

  useFocusEffect(
    useCallback(() => {
      refetchProfile();
    }, [refetchProfile]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchProfile();
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchProfile]);

  function logoutHanlder() {
    setModalVisible(true);
  }

  const handleYes = async () => {
    try {
      const response = await logout().unwrap();
      console.log("Logout response:", response);

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("role");
      await AsyncStorage.removeItem("isVerified");

      toast.success("Logged Out Successfully");
      setModalVisible(false);
      router.replace("/onboarding/loginChoice");
    } catch (error) {
      console.error("Logout error:", error);
      setModalVisible(false);

      toast.error("Logout Failed. Please try again.");
    }
  };

  const handleNo = () => {
    setModalVisible(false);
  };

  if (profileLoading && !profile) {
    return (
      <View className="flex-1 bg-[#F9F9F9] items-center justify-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="font-poppins-medium text-sm text-[#565656] mt-3">
          Loading profile...
        </Text>
      </View>
    );
  }

  if (logoutLoading) {
    return (
      <View className="flex-1 bg-[#F9F9F9] items-center justify-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="font-poppins-medium text-sm text-[#565656] mt-3">
          Logging out...
        </Text>
      </View>
    );
  }

  // Error state
  if (profileError && !profile) {
    return (
      <View className="flex-1 bg-[#F9F9F9] items-center justify-center px-[5%]">
        <Text className="font-poppins-semiBold text-base text-[#1F2937] mb-2">
          Unable to load profile
        </Text>
        <Text className="font-poppins-regular text-sm text-[#565656] text-center mb-4">
          Please check your connection and try again
        </Text>
        <Pressable
          onPress={() => refetchProfile()}
          className="bg-[#007AFF] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-medium text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
            colors={["#007AFF"]}
          />
        }
      >
        <View className="flex-1 px-[6%] bg-[#F9F9F9]">
          {/* Contractor Details */}
          <ContractorDetails userData={profile?.data?.user} />
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
                  yesText={logoutLoading ? "Logging out..." : "Yes"}
                  noText="No"
                  onYes={handleYes}
                  onNo={handleNo}
                  isLoading={logoutLoading}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
