import {
  Image,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileMenuItem from "../components/tabs/profile/ProfileMenuItem";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import ConfirmationModal from "../components/tabs/profile/ConfirmationModal";
import { useState, useCallback } from "react";
import LogoutItem from "../components/tabs/profile/LogoutItem";
import { router, useFocusEffect } from "expo-router";
import {
  editProfile,
  notification,
  accountSettings,
  support,
} from "../../../assets/svg/profile";
import { useLogoutUserMutation } from "../../redux/features/apiSlices/auth/authApiSlices";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserProfileQuery } from "../../redux/features/apiSlices/user/userApiSlices";
import { useDispatch } from "react-redux";
export default function UserProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [logout, { isLoading: logoutLoading }] = useLogoutUserMutation();
const dispatch = useDispatch();
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfileQuery();


  useFocusEffect(
    useCallback(() => {
      refetchProfile();
    }, [refetchProfile])
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

  function logoutHandler() {
    setModalVisible(true);
  }

  const handleYes = async () => {
    try {
      await logout().unwrap();
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("role");
     dispatch({ type: "RESET_STORE" }); 
      setModalVisible(false);
 
      Toast.show({
        type: "success",
        text1: "Logged Out Successfully",
        text2: "See you soon! 👋",
        position: "top",
        visibilityTime: 2000,
      });

      setTimeout(() => {
        router.replace("/onboarding/loginChoice");
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      setModalVisible(false);

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

  const { profilePhoto, fullName } = profile?.data?.user || {};


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


  if (profileError && !profile) {
    return (
      <View className="flex-1 bg-[#F9F9F9] items-center justify-center px-[5%]">
        <Text className="font-poppins-semiBold text-base text-[#1F2937] mb-2">
          Unable to load profile
        </Text>
        <Text className="font-poppins-regular text-sm text-[#565656] text-center mb-4">
          Please check your connection and try again
        </Text>
        <TouchableOpacity
          onPress={() => refetchProfile()}
          className="bg-[#007AFF] px-6 py-3 rounded-lg"
        >
          <Text className="font-poppins-medium text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9F9F9]">
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
        <View className="px-[5%] pb-6">
          <View className="pt-4">
            <Text className="font-poppins-semiBold text-center text-lg text-[#1F2937]">
              My Profile
            </Text>
          </View>

          <View className="mt-[2%] items-center justify-center">
            {profilePhoto?.url ? (
              <Image
                source={{
                  uri: profilePhoto.url,
                }}
                style={{ width: scale(96), height: verticalScale(96) }}
                className="rounded-full border-2 border-white"
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  width: scale(96),
                  height: verticalScale(96),
                }}
                className="rounded-full border-2 border-white bg-[#E5E7EB] items-center justify-center"
              >
                <Ionicons name="person" size={48} color="#6B7280" />
              </View>
            )}
            <Text className="font-poppins-semiBold text-lg text-[#565656] mt-2">
              {fullName || "N/A"}
            </Text>
          </View>

          <View className="mt-[3%]">
            <ProfileMenuItem
              iconName={editProfile}
              label="Edit Profile"
              onPress={() => router.push("/profile/editProfile")}
            />
            <ProfileMenuItem
              iconName={accountSettings}
              onPress={() => router.push("/profile/settings")}
              label="Account Settings"
            />
            <ProfileMenuItem
              iconName={support}
              onPress={() => router.push("/profile/support")}
              label="Help & support"
            />

            <LogoutItem onPress={logoutHandler} />

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
      </ScrollView>
    </View>
  );
}
