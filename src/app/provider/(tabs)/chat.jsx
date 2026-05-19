import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { verticalScale } from "../../components/adaptive/Adaptiveness";
import { router, useFocusEffect } from "expo-router";
import { useGetChatsQuery } from "../../../redux/features/apiSlices/chat/chatApiSlices";
import { formatDatesRelative } from "../../util/helper-function";
import { useSocket } from "../../../hooks/useSokect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const MessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const { data, isLoading, refetch } = useGetChatsQuery();
  const { socket, isConnected } = useSocket("https://api.quoto.ca");
  const [userStatus, setUserStatus] = useState({});

  // Load initial chats
  useEffect(() => {
    if (!isLoading && data?.data?.chats) {
      setMessages(data.data.chats);
    }
  }, [isLoading, data]);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("📱 Provider Messages Screen focused - Refreshing chats...");
      refetch();
    }, [refetch]),
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
      console.log("🔄 Provider messages refresh completed");
    } catch (error) {
      console.error("❌ Provider messages refresh failed:", error);
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

      console.log("💡 Joining personal & notification rooms for user:", userId);
      socket.emit("user-join", userId);
      socket.emit("join-notifications", userId);

      messages.forEach((chat) => {
        socket.emit("join-chat", chat._id);
      });
    };

    joinRooms();
  }, [socket, isConnected, messages]);

  const handleNewMessage = (message) => {
    console.log("📨 New message received within provider tabs:", message);

    setMessages((prev) => {
      const chatExists = prev.find((chat) => chat._id === message.chat);
      if (chatExists) {
        return prev.map((chat) =>
          chat._id === message.chat ? { ...chat, lastMessage: message } : chat,
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
      `⚡ ${userId} is ${isOnline ? "online" : "offline"} (lastActive: ${lastActive})`,
    );

    // Update local state
    setUserStatus((prev) => ({
      ...prev,
      [userId]: { isOnline, lastActive },
    }));
  };

  // Handle typing indicator
  const handleUserTyping = ({ userId, isTyping, chatId }) => {
    console.log(`✍️ ${userId} is ${isTyping ? "typing..." : "not typing"}`);

    setTypingUsers((prev) => ({
      ...prev,
      [chatId]: isTyping ? userId : null,
    }));
  };

  // Socket listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("new-message", handleNewMessage);
    socket.on("user-status-changed", handleUserStatusChanged);
    socket.on("user-typing", handleUserTyping);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-status-changed", handleUserStatusChanged);
      socket.off("user-typing", handleUserTyping);
    };
  }, [socket, isConnected, messages]);

  // Navigate to chat screen
  const markMessageAsRead = (chatId, providerId) => {
    router.push({
      pathname: "/chat/providerChat",
      params: { chatId: chatId, providerId: providerId },
    });
  };

  const renderMessageItem = ({ item }) => {
    const clientParticipant = item?.participants?.find(
      (p) => p?.role === "client",
    );

    const lastMessage = item?.lastMessage?.content?.text;
    const isRead = item?.lastMessage?.isRead;
    const providerId = clientParticipant?.user?._id;
    const isActive = clientParticipant?.user?.isOnline;
    const profilePhotoUrl = clientParticipant?.user?.profilePhoto?.url ?? null;
    const isTyping = typingUsers[item._id] === providerId;
    const isMediaExist = !!item?.lastMessage?.content?.media.length;
    const mediaCount = item?.lastMessage?.content?.media.length || 0;

    return (
      <Pressable
        className="w-full mb-[3%] px-[4%]"
        activeOpacity={0.75}
        onPress={() => markMessageAsRead(item._id, providerId)}
      >
        <View
          className={`rounded-2xl px-[4%] py-[3.5%] flex-row items-center ${
            isRead
              ? "bg-[#EAF4FB] border border-[#C5DEF0]"
              : "bg-white border border-[#E5E7EB]"
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {/* Avatar */}
          <View className="mr-3 relative">
            {profilePhotoUrl ? (
              <Image
                source={{ uri: profilePhotoUrl }}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-[#DBEAFE] items-center justify-center">
                <Ionicons name="person" size={22} color="#3B82F6" />
              </View>
            )}
            {isActive && (
              <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#22C55E] rounded-full border-2 border-white" />
            )}
          </View>

          {/* Message Content */}
          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-[2%]">
              <Text
                className={`font-poppins-600semibold text-sm ${
                  isRead ? "text-[#555]" : "text-[#1A1A1A]"
                }`}
              >
                {clientParticipant?.user?.fullName || "N/A"}
              </Text>
              <Text className="text-[#9CA3AF] font-poppins-400regular text-[11px]">
                {formatDatesRelative(item?.lastMessage?.updatedAt) || "N/A"}
              </Text>
            </View>

            <View className="flex-row items-center">
              {isTyping ? (
                <Text className="text-[#3B82F6] font-poppins-400regular text-xs italic">
                  typing...
                </Text>
              ) : (
                <>
                  {isMediaExist && (
                    <Ionicons
                      name="attach"
                      size={13}
                      color={isRead ? "#9CA3AF" : "#6B7280"}
                      style={{ marginRight: 3 }}
                    />
                  )}
                  <Text
                    className={`font-poppins-400regular text-xs flex-1 ${
                      isRead ? "text-[#9CA3AF]" : "text-[#4B5563]"
                    }`}
                    numberOfLines={1}
                  >
                    {isMediaExist
                      ? `${mediaCount} ${mediaCount === 1 ? "attachment" : "attachments"}${lastMessage ? ` • ${lastMessage}` : ""}`
                      : lastMessage || "N/A"}
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Read indicator */}
          <View className="ml-3 items-center justify-center">
            {isRead ? (
              <View className="w-5 h-5 bg-[#3B82F6] rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={12} color="white" />
              </View>
            ) : (
              <View className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full" />
            )}
          </View>
        </View>
      </Pressable>
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
