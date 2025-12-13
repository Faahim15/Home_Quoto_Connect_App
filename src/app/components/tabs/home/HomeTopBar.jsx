import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useSocket } from "../../../../hooks/useSokect";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetNotificationsQuery } from "../../../../redux/features/apiSlices/chat/chatApiSlices";

export default function HomeTopBar({ userData, mode }) {
  // const { socket, isConnected } = useSocket("ws://10.10.20.30:5000");
  const { fullName, location, profilePhoto, isVerified } = userData || {};

  const [notifications, setNotifications] = useState([]);
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery();

  // console.log("show", userData?.isVerified);

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Initialize notifications from API data
  useEffect(() => {
    if (data?.success && data?.data?.notifications) {
      setNotifications(data.data.notifications);
    }
  }, [data]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // const [currentUserId, setCurrentUserId] = useState(null);
  // const [unreadCount, setUnreadCount] = useState(0);

  // getting userId
  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     const userId = await AsyncStorage.getItem("userId");
  //     if (userId) setCurrentUserId(userId);
  //   };
  //   fetchUserId();
  // }, []);

  // join notification room
  // useEffect(() => {
  //   if (!socket || !currentUserId) return;

  //   socket.emit("join-notifications", { userId: currentUserId });
  // }, [socket, currentUserId]);

  // get initial unread count
  // useEffect(() => {
  //   if (!socket || !currentUserId) return;

  //   socket.emit("get-unread-count", currentUserId);
  // }, [socket, currentUserId]);

  //get unreadCount

  // const handleUnreadCount = ({ count }) => {
  //   console.log("Unread count:", count);
  //   setUnreadCount(count);
  // };

  // listen for socket events
  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on("unread-count", handleUnreadCount);

  //   return () => {
  //     socket.off("unread-count", handleUnreadCount);
  //   };
  // }, [socket]);

  const handleNotificationPress = () => {
    // if (socket && currentUserId) {
    //   socket.emit("mark-all-notifications-read", { userId: currentUserId });
    // }

    router.push("shared/notification");
  };

  const handleEditProfile = () => {
    router.push("/profile/editProfile");
  };

  return (
    <View className="flex-row pb-[1%] mx-[6.4%] mt-[2%] gap-[2%]">
      <View>
        <Pressable onPress={handleEditProfile}>
          {profilePhoto?.url ? (
            <Image
              style={{
                width: scale(32),
                height: verticalScale(32),
                borderRadius: scale(16),
              }}
              source={{ uri: profilePhoto.url }}
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={scale(32)}
              color="#888" // you can adjust color
            />
          )}
        </Pressable>
      </View>

      <View className="flex-row w-[90%] justify-between">
        <View>
          <Text className="font-poppins-bold text-base">Welcome to Quoto!</Text>
          <View className="flex-row items-center gap-[2%]">
            <Text className="font-poppins-400regular text-xs text-[#4D4D4D]">
              {fullName || "N/A"}
            </Text>
            {mode !== "user" &&
              (isVerified ? (
                <Ionicons name="checkmark-circle" size={14} color="#175994" />
              ) : (
                <View className="bg-gray-200 px-1.5 py-0.5 rounded">
                  <Text className="font-poppins-400regular text-[8px] text-gray-600">
                    Unverified
                  </Text>
                </View>
              ))}
          </View>
          <View className="flex-row gap-[1%] mt-[2%]">
            <Ionicons name="location-outline" size={14} color="#8891AA" />
            <Text className="font-poppins-400regular text-xs text-[#8891AA]">
              {location?.city || "N/A"},{location?.state || "N/A"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleNotificationPress}
          style={{ width: scale(30), height: verticalScale(30) }}
          className="rounded-full items-center justify-center border border-[#175994]"
        >
          <Ionicons name="notifications-outline" size={20} color="#175994" />
          {unreadCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-[#FF3B30] rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center border-[1.5px] border-white">
              <Text className="text-white text-[10px] font-poppins-semibold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
