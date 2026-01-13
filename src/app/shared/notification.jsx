import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useSocket } from "../../hooks/useSokect";
import { useGetNotificationsQuery } from "../../redux/features/apiSlices/chat/chatApiSlices";
import CustomTitle from "../components/shared/services/CustomTitle";

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentUserId, setCurrentUserId] = useState(null);

  const { socket } = useSocket(
    "wss://myqoute-eudjatd9a3f8eua8.southeastasia-01.azurewebsites.net"
  );
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery();

  // Refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Get userId from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) setCurrentUserId(userId);
    };
    fetchUserId();
  }, []);

  // Initialize notifications from API data
  useEffect(() => {
    if (data?.success && data?.data?.notifications) {
      setNotifications(data.data.notifications);
    }
  }, [data]);

  // Join notification room
  useEffect(() => {
    if (!socket || !currentUserId) return;

    console.log("join-notifications from notification.js");
    socket.emit("join-notifications", { userId: currentUserId });
  }, [socket, currentUserId]);

  // Socket event handlers
  const handleNewNotification = (notification) => {
    console.log("New notification received:", notification);
    setNotifications((prev) => [notification, ...prev]);
  };

  const handleNotificationRead = ({ notificationId }) => {
    console.log("Notification marked as read:", notificationId);
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // const handleAllNotificationsRead = () => {
  //   console.log("All notifications marked as read");
  //   setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  // };

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    socket.on("new-notification", handleNewNotification);
    socket.on("notification-read", handleNotificationRead);
    // socket.on("all-notifications-read", handleAllNotificationsRead);

    return () => {
      socket.off("new-notification", handleNewNotification);
      socket.off("notification-read", handleNotificationRead);
      // socket.off("all-notifications-read", handleAllNotificationsRead);
    };
  }, [socket]);

  const markAsRead = (notificationId) => {
    if (!socket || !currentUserId) return;
    socket.emit("mark-notification-read", { notificationId });
  };

  // const markAllAsRead = () => {
  //   if (!socket || !currentUserId) return;
  //   socket.emit("mark-all-notifications-read", { userId: currentUserId });
  // };

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  // console.log("unreadCount", unreadCount);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderNotificationItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => !item.read && markAsRead(item._id)}
      activeOpacity={0.7}
      className={`px-[6%] py-[4%] ${!item.read ? "bg-blue-50" : "bg-white"} ${
        index !== filteredNotifications.length - 1
          ? "border-b border-gray-200"
          : ""
      }`}
    >
      <Text
        className={`text-base font-medium mb-[1%] ${
          !item.read ? "text-gray-900" : "text-gray-700"
        }`}
      >
        {item.title}
      </Text>
      <Text
        className={`text-sm leading-relaxed mb-[2%] ${
          !item.read ? "text-gray-700" : "text-gray-500"
        }`}
      >
        {item.message}
      </Text>
      <View className="flex-row items-center gap-[2%]">
        <Text className="text-xs text-gray-400">
          {formatTime(item.createdAt)}
        </Text>
        {!item.read && (
          <View className="w-[6px] h-[6px] bg-blue-600 rounded-full" />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center flex-1 px-[6%]">
      <Text className="text-6xl mb-[4%]">🔔</Text>
      <Text className="text-lg font-poppins-semiBold text-gray-900 mb-[2%]">
        {filter === "unread" ? "No unread notifications" : "No notifications"}
      </Text>
      <Text className="text-gray-500 text-center">
        {filter === "unread"
          ? "You're all caught up!"
          : "When you get notifications, they'll show up here"}
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View className="items-center justify-center flex-1">
      <ActivityIndicator size="large" color="#175994" />
      <Text className="text-gray-500 mt-[4%]">Loading notifications...</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-[#f9f9f9]">
        <View className="items-center justify-center flex-1 px-[6%]">
          <Text className="text-lg font-semibold text-gray-900 mb-[2%]">
            Error loading notifications
          </Text>
          <Text className="text-gray-500 text-center mb-[4%]">
            Please try again later
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-blue-600 px-[6%] py-[3%] rounded-lg"
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      {/* Header */}
      <View className="bg-[#f9f9f9] border-b border-gray-200">
        <View className="mx-[6%] py-[4%]">
          <View className="">
            {/* <Text className="text-2xl font-poppins-semiBold text-gray-900">
              Notifications
            </Text> */}

            {/* {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead}>
                <Text className="text-sm text-blue-600 font-medium">
                  Mark all read
                </Text>
              </TouchableOpacity>
            )} */}

            {/* <CustomTitle title="Notifications" /> */}
          </View>

          {/* Filter Tabs */}
          <View className="flex-row gap-[6%]">
            <TouchableOpacity
              onPress={() => setFilter("all")}
              className="pb-[3%] relative"
            >
              <Text
                className={`font-poppins-500medium text-base ${
                  filter === "all" ? "text-blue-600" : "text-gray-500"
                }`}
              >
                All
              </Text>
              {filter === "all" && (
                <View className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter("unread")}
              className="pb-[3%] relative"
            >
              <Text
                className={`font-medium text-base ${
                  filter === "unread" ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </Text>
              {filter === "unread" && (
                <View className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          filteredNotifications.length === 0 ? { flex: 1 } : undefined
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={["#175994"]}
          />
        }
      />
    </View>
  );
}
