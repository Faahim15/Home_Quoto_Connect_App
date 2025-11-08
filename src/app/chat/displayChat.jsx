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
import { io } from "socket.io-client";
import { useLocalSearchParams } from "expo-router";
import { useGetProviderDetailsQuery } from "../../redux/features/apiSlices/user/createJobSlices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useDirectChatMutation,
  useGetSingleChatHistoryQuery,
} from "../../redux/features/apiSlices/chat/chatApiSlices";
import { formatedDate } from "../util/helper-function";

const ChatScreen = ({ route }) => {
  const { providerId } = useLocalSearchParams();
  const { data, isLoading } = useGetProviderDetailsQuery(providerId);

  const { width: screenWidth } = Dimensions.get("window");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [chatId, setChatId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [sendMessageToProvider, { isLoading: chatLoading }] =
    useDirectChatMutation();

  const userData = route?.params?.userData || {
    name: "Jhonson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=faces",
    status: "Active Now",
    userId: "user_123",
  };

  // Socket connection and event handlers
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("❌ Token missing for socket connection");
          return;
        }

        const newSocket = io("http://10.10.20.30:5000", {
          transports: ["websocket"],
          auth: { token },
        });

        newSocket.on("connect", () => {
          console.log("✅ Socket connected:", newSocket.id);
          setIsConnected(true);
        });

        newSocket.on("disconnect", (reason) => {
          console.log("❌ Socket disconnected:", reason);
          setIsConnected(false);
        });

        newSocket.on("connect_error", (err) => {
          console.log("🚨 Socket connection error:", err.message);
          setIsConnected(false);
        });

        // Real-time message receive
        newSocket.on("receive-message", (message) => {
          console.log("📩 New message received via socket:", message);
          setMessages((prev) => {
            // Avoid duplicates
            if (!prev.some((msg) => msg._id === message._id)) {
              return [...prev, message];
            }
            return prev;
          });
        });

        // Typing indicators
        newSocket.on("user-typing", (data) => {
          if (data.chatId === chatId && data.userId !== userData.userId) {
            setIsTyping(true);
          }
        });

        newSocket.on("user-stop-typing", (data) => {
          if (data.chatId === chatId && data.userId !== userData.userId) {
            setIsTyping(false);
          }
        });

        // Join chat room when chatId is available
        newSocket.on("joined-chat", (data) => {
          console.log("✅ Joined chat room:", data.chatId);
        });

        setSocket(newSocket);

        return () => {
          if (newSocket) {
            newSocket.disconnect();
            newSocket.removeAllListeners();
          }
        };
      } catch (error) {
        console.log("🚨 Socket initialization error:", error);
      }
    };

    initializeSocket();
  }, []);

  // Join chat room when chatId and socket are available
  useEffect(() => {
    if (socket && isConnected && chatId) {
      console.log("🎯 Joining chat room:", chatId);
      socket.emit("join-chat", { chatId });
    }
  }, [socket, isConnected, chatId]);

  // Fetch initial chat history
  const fetchInitialChat = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("❌ Token missing");
        return;
      }
      if (!providerId) {
        console.log("❌ providerId missing");
        return;
      }

      console.log("📡 Fetching initial chat for provider:", providerId);

      const response = await fetch(`http://10.10.20.30:5000/api/chats/direct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          providerId: providerId,
          content: " ",
          messageType: "text",
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Chat initialized successfully:", data?.data?.chat?._id);
        setChatId(data?.data?.chat?._id);
        setMessages(data?.data?.messages || []);
      } else {
        console.error("❌ Failed to initialize chat:", data);
        Alert.alert("Error", data.message || "Failed to initialize chat");
      }
    } catch (error) {
      console.error("🚨 Error initializing chat:", error);
      Alert.alert("Error", "Failed to initialize chat");
    }
  }, [providerId]);

  // Fetch chat when providerId is available
  useEffect(() => {
    if (providerId) {
      fetchInitialChat();
    }
  }, [providerId, fetchInitialChat]);

  // Get chat history when chatId is available
  const {
    data: singleChatHistory,
    isLoading: chatLoader,
    error: chatError,
    refetch: refetchChatHistory,
  } = useGetSingleChatHistoryQuery(chatId, {
    skip: !chatId, // Skip if no chatId
  });

  // Update messages when chat history is fetched
  useEffect(() => {
    if (singleChatHistory?.success && singleChatHistory?.data?.messages) {
      console.log(
        "📚 Chat history loaded:",
        singleChatHistory.data.messages.length,
        "messages"
      );
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
    if (socket && isConnected && chatId) {
      socket.emit("typing", { chatId });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [socket, isConnected, chatId]);

  const handleTypingStop = useCallback(() => {
    if (socket && isConnected && chatId) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", { chatId });
      }, 1000);
    }
  }, [socket, isConnected, chatId]);

  // Send message function
  const sendMessage = async () => {
    try {
      if (!newMessage.trim() && selectedMedia.length === 0) {
        return;
      }

      if (!providerId) {
        Alert.alert("Error", "Provider ID is missing");
        return;
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Authentication token missing");
        return;
      }

      // Create message payload
      const messagePayload = {
        providerId: providerId,
        content: newMessage.trim(),
        messageType: "text",
        // Add media if available
        ...(selectedMedia.length > 0 && { media: selectedMedia }),
      };

      console.log("📤 Sending message:", messagePayload);

      // Send via REST API first
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
        console.log("✅ Message sent successfully:", data.data.message);

        // Update local state immediately for better UX
        setMessages((prev) => [...prev, data.data.message]);
        setNewMessage("");
        setSelectedMedia([]);

        // Emit via socket for real-time
        if (socket && isConnected) {
          socket.emit("send-message", {
            ...data.data.message,
            chatId: chatId,
          });
        }

        // Refetch chat history to ensure consistency
        await refetchChatHistory();

        scrollToBottom();
      } else {
        console.error("❌ Error sending message:", data);
        Alert.alert("Error", data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("🚨 Exception while sending message:", error);
      Alert.alert("Error", "Something went wrong while sending message.");
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

  if (isLoading || chatLoader) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#18649F" />
        <Text className="mt-4 text-gray-500">Loading chat...</Text>
      </View>
    );
  }

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
          onLayout={scrollToBottom}
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
          isLoading={chatLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
