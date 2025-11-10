import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import ChatHeader from "../components/tabs/chat/ChatHeader";
import MessageInput from "../components/tabs/chat/MessageInput";
import { useLocalSearchParams } from "expo-router";
import { useGetProviderDetailsQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useDirectChatMutation,
  useGetChatsQuery,
  useGetSingleChatHistoryQuery,
} from "../../redux/features/apiSlices/chat/chatApiSlices";
import { formatedDate } from "../util/helper-function";
import { useSocket } from "../../hooks/useSokect";

const ChatScreen = () => {
  const { providerId } = useLocalSearchParams();
  const { data, isLoading } = useGetProviderDetailsQuery(providerId);
  const { width: screenWidth } = Dimensions.get("window");
  const { socket, isConnected } = useSocket("http://10.10.20.30:5000");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { data: chatData, isLoading: allChatLoader } = useGetChatsQuery();
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [chatId, setChatId] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  // const [isConnected, setIsConnected] = useState(false);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) setCurrentUserId(userId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const joinRooms = async () => {
      if (!socket || !isConnected || !currentUserId || !chatId) return;
      console.log("sender User Id:", currentUserId);
      // 1️⃣ Personal room
      // console.log("💡 Joining personal socket room for user:", currentUserId);
      socket.emit("user-join", currentUserId);

      // 2️⃣ Notifications room
      // console.log("🔔 Joining notification room for user:", currentUserId);
      socket.emit("join-notifications", currentUserId);

      // 3️⃣ Chat room
      console.log("🎯 Joining chat room:", chatId);
      socket.emit("join-chat", chatId);
    };

    joinRooms();
  }, [socket, isConnected, currentUserId, chatId]);

  // Fetch initial chat history
  // const fetchInitialChat = useCallback(async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     if (!token) {
  //       console.log("❌ Token missing");
  //       return;
  //     }
  //     if (!providerId) {
  //       console.log("❌ providerId missing");
  //       return;
  //     }

  //     console.log("📡 Fetching initial chat for provider:", providerId);

  //     const response = await fetch(`http://10.10.20.30:5000/api/chats/direct`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         providerId: providerId,
  //         content: " ",
  //         messageType: "text",
  //       }),
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       console.log("✅ Chat initialized successfully:", data?.data?.chat?._id);
  //       setChatId(data?.data?.chat?._id);
  //       setMessages(data?.data?.messages || []);
  //     } else {
  //       console.error("❌ Failed to initialize chat:", data);
  //       Alert.alert("Error", data.message || "Failed to initialize chat");
  //     }
  //   } catch (error) {
  //     console.error("🚨 Error initializing chat:", error);
  //     Alert.alert("Error", "Failed to initialize chat");
  //   }
  // }, [providerId]);

  // useEffect(() => {
  //   if (providerId) {
  //     fetchInitialChat();
  //   }
  // }, [providerId, fetchInitialChat]);

  // Combine loading checks for provider and all chats
  if (isLoading || allChatLoader) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#18649F" />
        <Text className="mt-4 text-gray-500">Loading chat...</Text>
      </View>
    );
  }

  // 🧩 Find provider chat when chatData or providerId changes
  useEffect(() => {
    if (chatData?.data?.chats?.length && providerId) {
      const providerChat = chatData.data.chats.find((chat) =>
        chat?.participants?.some((p) => p?.user?._id === providerId)
      );

      if (providerChat?._id) {
        console.log("💬 Found provider chat ID:", providerChat._id);
        setChatId(providerChat._id);
      } else {
        console.log("⚠️ No existing chat found for provider:", providerId);
      }
    }
  }, [chatData, providerId]);

  // ✅ Fetch chat history only when chatId is available
  const {
    data: singleChatHistory,
    isLoading: chatLoader,
    error: chatError,
    refetch: refetchChatHistory,
  } = useGetSingleChatHistoryQuery(chatId, {
    skip: !chatId,
  });

  // 🔁 Refetch chat history when chatId becomes available
  useEffect(() => {
    if (chatId && refetchChatHistory) {
      console.log("📥 Fetching single chat history for chatId:", chatId);
      refetchChatHistory();
    }
  }, [chatId, refetchChatHistory]);

  // 📨 Update messages when chat history is fetched
  useEffect(() => {
    if (singleChatHistory?.success && singleChatHistory?.data?.messages) {
      setMessages(singleChatHistory.data.messages);
    }
  }, [singleChatHistory]);

  // Permissions
  const requestPermissions = async () => {
    try {
      const [cameraPermission, mediaPermission] = await Promise.all([
        ImagePicker.requestCameraPermissionsAsync(),
        ImagePicker.requestMediaLibraryPermissionsAsync(),
      ]);

      if (
        cameraPermission.status !== "granted" ||
        mediaPermission.status !== "granted"
      ) {
        Alert.alert(
          "Permission Required",
          "Camera and media library permissions are needed to send media"
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  };

  // Media handling functions
  const selectFromLibrary = async () => {
    setShowMediaModal(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const mediaArray = result.assets.map((media) => ({
        uri: media.uri,
        type: media.type,
        width: media.width,
        height: media.height,
        fileName:
          media.fileName ||
          `media_${Date.now()}.${media.type === "video" ? "mp4" : "jpg"}`,
        fileSize: media.fileSize,
      }));
      setSelectedMedia(mediaArray);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      const photo = result.assets[0];
      setSelectedMedia([
        {
          uri: photo.uri,
          type: "image",
          width: photo.width,
          height: photo.height,
          fileName: `photo_${Date.now()}.jpg`,
          fileSize: photo.fileSize,
        },
      ]);
    }
  };

  const recordVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoMaxDuration: 120,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      const video = result.assets[0];
      setSelectedMedia([
        {
          uri: video.uri,
          type: "video",
          width: video.width,
          height: video.height,
          fileName: `video_${Date.now()}.mp4`,
          fileSize: video.fileSize,
          duration: video.duration,
        },
      ]);
    }
  };

  const removeSelectedMedia = (index = null) => {
    if (index !== null) {
      setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
    } else {
      setSelectedMedia([]);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Typing handlers
  const handleTypingStart = useCallback(() => {
    if (!socket || !isConnected || !chatId) return;

    console.log("✍️ Typing started...");
    socket.emit("typing-start", { chatId });

    // Clear the previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to automatically stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      console.log("⌛ Typing stopped (auto)");
      socket.emit("typing-stop", { chatId });
    }, 3000);
  }, [socket, isConnected, chatId]);

  const handleTypingStop = useCallback(() => {
    if (!socket || !isConnected || !chatId) return;

    console.log("🛑 Typing stopped manually");
    socket.emit("typing-stop", { chatId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [socket, isConnected, chatId]);

  // Listen for new messages
  const handleNewMessage = (data) => {
    console.log("📩 New message received via wihting user room:", data);

    // Option 1: Just refetch from backend for full sync
    // refetchChatHistory();
    // console.log("show all", messages);

    // Option 2 (optional): Also append instantly for faster UI response
    setMessages((prev) => [...prev, data]);

    // Optionally scroll to bottom
    scrollToBottom();
  };

  // Listen for new messages
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, isConnected, refetchChatHistory]);

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() && selectedMedia.length === 0) return;

    const token = await AsyncStorage.getItem("token");

    const messagePayload = {
      providerId,
      content: newMessage.trim() || " ",
      // media: selectedMedia.length > 0 ? selectedMedia : [],
      messageType: "text",
    };
    // console.log("content", typeof messagePayload.content);
    const response = await fetch(`http://10.10.20.30:5000/api/chats/direct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(messagePayload),
    });

    const data = await response.json();

    if (data.success) {
      // setMessages((prev) => [...prev, data.data.message]);
      setNewMessage("");
      setSelectedMedia([]);
      setChatId(data?.data?.chat?._id);
      console.log("message has successfully sent from display message");
      // Socket emit
      // if (socket && isConnected) {
      //   socket.emit("send-message", {
      //     ...data.data.message,
      //     chatId,
      //   });
      //   console.log("messaged emitted", chatId);
      // }
    } else {
      Alert.alert("Error", data.message || "Failed to send message");
    }
  };

  const renderMessageItem = ({ item }) => {
    if (item?.content?.text === " ") {
      return null;
    }

    const isOwn = item?.sender?.role === "client";

    return (
      <View className={`mb-[4%] ${isOwn ? "items-end" : "items-start"}`}>
        <View
          className={`max-w-[75%] rounded-2xl overflow-hidden ${isOwn ? "bg-[#319FCA] rounded-br-md" : "bg-white rounded-bl-md shadow-sm"}`}
        >
          {item.media?.map((media, index) => (
            <View key={index} className="relative" style={{ margin: scale(4) }}>
              {media.type === "image" ? (
                <Image
                  source={{ uri: media.uri }}
                  style={{
                    width: screenWidth * (item.media.length === 1 ? 0.6 : 0.28),
                    height:
                      screenWidth *
                      (item.media.length === 1
                        ? 0.6 * (media.height / media.width)
                        : 0.28),
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: screenWidth * (item.media.length === 1 ? 0.6 : 0.28),
                    height: screenWidth * 0.28,
                    backgroundColor: "#ccc",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                >
                  <Ionicons name="play-circle" size={32} color="#319FCA" />
                </View>
              )}
            </View>
          ))}
          {item?.content?.text && item?.content?.text !== " " && (
            <View className="px-4 py-3">
              <Text
                className={`text-base ${isOwn ? "text-white" : "text-gray-800"}`}
              >
                {item?.content?.text}
              </Text>
            </View>
          )}
        </View>
        {item?.content?.text && item?.content?.text !== " " && (
          <Text className="text-xs text-gray-500 mt-1 mx-1">
            {formatedDate(item?.createdAt)}
          </Text>
        )}
      </View>
    );
  };

  const { profilePhoto, fullName, isOnline, lastActive } =
    data?.data?.provider || {};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "ios" ? (selectedMedia.length ? -30 : 0) : 20
        }
      >
        <ChatHeader
          userData={{
            name: fullName,
            isOnline,
            profilePhoto: profilePhoto?.url,
            lastActive,
          }}
        />

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) => item._id || `message-${index}`}
          contentContainerStyle={{
            padding: scale(16),
            paddingBottom: verticalScale(20),
          }}
          onContentSizeChange={scrollToBottom}
          // onLayout={scrollToBottom}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

        {isTyping && (
          <View className="px-4 pb-2">
            <View className="bg-white rounded-2xl rounded-bl-md px-4 py-3 max-w-[75%] shadow-sm">
              <Text className="text-gray-500 text-sm">
                {fullName} is typing...
              </Text>
            </View>
          </View>
        )}

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          selectedMedia={selectedMedia}
          removeSelectedMedia={removeSelectedMedia}
          showMediaModal={showMediaModal}
          setShowMediaModal={setShowMediaModal}
          selectFromLibrary={selectFromLibrary}
          takePhoto={takePhoto}
          recordVideo={recordVideo}
          sendMessage={sendMessage}
          handleTypingStart={handleTypingStart}
          handleTypingStop={handleTypingStop}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
