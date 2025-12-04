import { useEffect, useState, useLayoutEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { verticalScale } from "../components/adaptive/Adaptiveness";
import { router, useFocusEffect } from "expo-router";
import { useGetChatsQuery } from "../../redux/features/apiSlices/chat/chatApiSlices";
import { useSocket } from "../../hooks/useSokect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDateRelative } from "../util/helper-function";
import { Ionicons } from "@expo/vector-icons";

const MessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, refetch } = useGetChatsQuery();
  const { socket, isConnected } = useSocket("http://10.10.20.30:5000");
  const [userStatus, setUserStatus] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  // Load initial chats
  useEffect(() => {
    if (!isLoading && data?.data?.chats) {
      setMessages(data.data.chats);
    }
  }, [isLoading, data]);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("📱 Screen focused - Refreshing chats...");
      refetch();
    }, [refetch])
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
      console.log("🔄 Manual refresh completed");
    } catch (error) {
      console.error("❌ Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Join personal, notification rooms and chat rooms
  useEffect(() => {
    const joinRooms = async () => {
      if (!socket || !isConnected || messages.length === 0) return;

      const userId = await AsyncStorage.getItem("userId");

      if (!userId) return;

      socket.emit("user-join", userId);
      socket.emit("join-notifications", userId);
      messages.forEach((chat) => {
        socket.emit("join-chat", chat._id);
      });
    };

    joinRooms();
  }, [socket, isConnected, messages]);

  const handleNewMessage = (message) => {
    console.log("📨 New message received within client tabs:", message);

    setMessages((prev) => {
      const chatExists = prev.find((chat) => chat._id === message.chat);
      if (chatExists) {
        return prev.map((chat) =>
          chat._id === message.chat ? { ...chat, lastMessage: message } : chat
        );
      } else {
        return [
          {
            _id: message.chat,
            lastMessage: message,
            participants: [message.sender, message.receiver],
          },
          ...prev,
        ];
      }
    });
  };

  // 🟢 Handle user online/offline status
  const handleUserStatusChanged = ({ userId, isOnline, lastActive }) => {
    console.log(
      `⚡ ${userId} is ${isOnline ? "online" : "offline"} (lastActive: ${lastActive})`
    );

    // Update local state
    setUserStatus((prev) => ({
      ...prev,
      [userId]: { isOnline, lastActive },
    }));
  };

  // Socket listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("new-message", handleNewMessage);
    socket.on("user-status-changed", handleUserStatusChanged);
    socket.on("user-typing", ({ userId, isTyping }) => setIsTyping(isTyping));

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-status-changed", handleUserStatusChanged);
      socket.off("user-typing");
    };
  }, [messages, isConnected]);

  // Navigate to chat screen
  const markMessageAsRead = (chatId, providerId) => {
    router.push({
      pathname: "/chat/displayChat",
      params: { chatId: chatId, providerId: providerId },
    });
  };

  const renderMessageItem = ({ item }) => {
    if (!item?.lastMessage) return null;

    const clientParticipant = item?.participants?.find(
      (p) => p?.role === "provider"
    );

    const lastMessage = item?.lastMessage?.content?.text;
    const isRead = item?.lastMessage?.isRead;
    const isActive = clientParticipant?.user?.isOnline;

    const providerId = clientParticipant?.user?._id;

    const profilePhotoUrl = clientParticipant?.user?.profilePhoto?.url ?? null;

    const isMediaExist = !!item?.lastMessage?.content?.media.length;
    const mediaCount = item?.lastMessage?.content?.media.length || 0;

    return (
      <TouchableOpacity
        className="w-full mb-[4%] px-[4%]"
        activeOpacity={0.7}
        onPress={() => markMessageAsRead(item._id, providerId)}
      >
        <View
          className={`border py-[3%] rounded-lg px-[3%] flex-row items-center ${
            isRead ? "bg-[#D1E8F1] border-[#D1E8F1]" : "bg-white"
          } border-[#d5d5d5]`}
        >
          {/* Avatar */}
          <View className="mr-3">
            {profilePhotoUrl ? (
              <Image
                source={{ uri: profilePhotoUrl }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
                <Ionicons name="person" size={24} color="#6B7280" />
              </View>
            )}
            {isActive && (
              <View className="absolute bottom-0 right-0 w-3 h-3 bg-[#44B700] rounded-full border-2 border-white" />
            )}
          </View>

          {/* Message Content */}
          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-[1%]">
              <Text className="text-[#333333] font-poppins-500medium text-base">
                {clientParticipant?.user?.fullName || "N/A"}
              </Text>
              <Text className="text-black font-poppins-400regular text-xs">
                {formatDateRelative(item?.lastMessage?.updatedAt) || "N/A"}
              </Text>
            </View>
            {isTyping ? (
              <Text className="text-[#0066CC] font-poppins-400regular text-xs mt-1">
                Typing...
              </Text>
            ) : (
              <View className="flex-row items-center">
                {isMediaExist && (
                  <Ionicons
                    name="attach"
                    size={14}
                    color={isRead ? "#767676" : "#111"}
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text
                  className={`font-poppins-400regular text-xs ${
                    isRead ? "text-[#767676]" : "text-[#111]"
                  }`}
                  numberOfLines={1}
                >
                  {isMediaExist
                    ? `${mediaCount} ${mediaCount === 1 ? "attachment" : "attachments"}${lastMessage ? ` • ${lastMessage}` : ""}`
                    : lastMessage || "N/A"}
                </Text>
              </View>
            )}
          </View>

          {/* Read Status */}
          <View className="ml-[2%]">
            {isRead ? (
              <View className="w-4 h-4 bg-blue-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs">✓</Text>
              </View>
            ) : (
              <View className="w-4 h-4 bg-gray-300 rounded-full" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      {/* Header */}
      <View className="bg-[#f9fafb] justify-center items-center py-[3%]">
        <Text className="text-[#333333] text-center text-xl font-poppins-500medium">
          Messages
        </Text>
      </View>

      {/* Loading / Empty / List */}
      {isLoading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0066CC" />
          <Text className="text-[#767676] font-poppins-400regular text-sm mt-3">
            Loading messages...
          </Text>
        </View>
      ) : data?.data?.chats?.length === 0 ? (
        <View className="flex-1 justify-center items-center px-[10%]">
          <Text className="text-6xl mb-4">💬</Text>
          <Text className="text-[#333333] font-poppins-500medium text-lg text-center mb-2">
            No Messages Yet
          </Text>
          <Text className="text-[#767676] font-poppins-400regular text-sm text-center">
            When you start a conversation, your messages will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages.length > 0 ? messages : data?.data?.chats || []}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) => item?._id || index.toString()}
          contentContainerStyle={{ paddingVertical: verticalScale(16) }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0066CC"]}
              tintColor="#0066CC"
              title="Pull to refresh"
              titleColor="#767676"
            />
          }
        />
      )}
    </View>
  );
};

export default MessagesScreen;
