import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import ChatHeader from "../components/tabs/chat/ChatHeader";
import MessageInput from "../components/tabs/chat/MessageInput";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetSingleChatHistoryQuery } from "../../redux/features/apiSlices/chat/chatApiSlices";
import { formatedDate } from "../util/helper-function";
import { useSocket } from "../../hooks/useSokect";
import * as FileSystem from "expo-file-system/legacy";
import { Modal } from "react-native";
import { SOCKET_URL } from "../components/constant/socketURL";

const ProviderChatScreen = () => {
  const { chatId } = useLocalSearchParams();

  const { width: screenWidth } = Dimensions.get("window");
  const { socket, isConnected } = useSocket(SOCKET_URL);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [userStatus, setUserStatus] = useState({});

  // console.log("chat", chatId);

  // Get chat history when chatId is available
  const {
    data: singleChatHistory,
    isLoading: chatLoader,
    refetch: refetchChatHistory,
  } = useGetSingleChatHistoryQuery(chatId, {
    skip: !chatId, // Skip if no chatId
  });

  useFocusEffect(
    useCallback(() => {
      if (chatId) {
        console.log("📌 Screen focused → fetching latest chat...");
        refetchChatHistory();
      }
    }, [chatId]),
  );

  // Update messages when chat history is fetched
  useEffect(() => {
    if (singleChatHistory?.success && singleChatHistory?.data?.messages) {
      setMessages(singleChatHistory.data.messages);
    }
  }, [singleChatHistory]);

  // Join personal, notification rooms and chat rooms
  useEffect(() => {
    const joinRooms = async () => {
      if (!socket || !isConnected || messages.length === 0) return;

      const userId = await AsyncStorage.getItem("userId");

      if (!userId) return;

      socket.emit("user-join", userId);
      socket.emit("join-notifications", userId);
      socket.emit("join-chat", chatId);
    };

    joinRooms();
  }, [socket, isConnected, messages]);

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
          "Camera and media library permissions are needed to send media",
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
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const formatted = result.assets.map((img) => ({
        uri: img.uri,
        type: "image",
        fileName: img.fileName || `photo_${Date.now()}.jpg`,
      }));

      setSelectedMedia(formatted);
    }
  };

  const takePhoto = async () => {
    setShowMediaModal(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      const photo = result.assets[0];
      setSelectedMedia((prev) => [
        ...prev,
        {
          uri: photo.uri,
          type: "image",
          fileName: photo.fileName || `photo_${Date.now()}.jpg`,
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

    socket.emit("typing-start", { chatId });

    // Clear the previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to automatically stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      //   console.log("⌛ Typing stopped (auto)");
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
  const handleNewMessage = useCallback((data) => {
    console.log("📩 New message received:", data);
    setMessages((prev) => {
      const exists = prev.some((m) => m._id === data._id);
      if (exists) return prev;
      return [...prev, data];
    });
    scrollToBottom();
  }, []);

  // 🟢 Handle user online/offline status
  const handleUserStatusChanged = ({ userId, isOnline, lastActive }) => {
    console.log(
      `⚡ ${userId} is ${isOnline ? "online from provider chat" : "offline"} (lastActive: ${lastActive})`,
    );

    // Update local state
    setUserStatus((prev) => ({
      ...prev,
      [userId]: { isOnline, lastActive },
    }));
  };

  // Listen for new messages
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("new-message", handleNewMessage);
    socket.on("user-status-changed", handleUserStatusChanged);
    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, isConnected]);

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() && (!selectedMedia || selectedMedia.length === 0))
      return;

    const media = [];
    if (selectedMedia && selectedMedia.length > 0) {
      for (const file of selectedMedia) {
        try {
          // Read file as base64
          const base64 = await FileSystem.readAsStringAsync(file.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Push media object with data URI format (like direct chat)
          media.push({
            type: file.type, // "image"
            filename: file.fileName,
            url: `data:image/jpeg;base64,${base64}`, // Send as data URI
          });
        } catch (err) {
          console.error("Error reading file:", err);
          Alert.alert("Error", `Failed to read file: ${file.fileName}`);
        }
      }
    }
    const content = {
      text: newMessage.trim(),
      media: Array.isArray(media) ? media : [],
    };
    // Normal message sending with existing chatId
    const payload = {
      chatId,
      content,
      messageType: selectedMedia && selectedMedia.length > 0 ? "image" : "text",
    };

    if (socket && isConnected) {
      socket.emit("send-message", payload);
      setNewMessage("");
      setSelectedMedia([]);
      refetchChatHistory();
      handleTypingStop && handleTypingStop();
      scrollToBottom();
    } else {
      console.warn("Socket not connected — cannot send message");
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const ImageModal = () => (
    <Modal
      visible={!!selectedImage}
      transparent={true}
      onRequestClose={() => setSelectedImage(null)}
    >
      <View className="flex-1 bg-black justify-center items-center">
        <Pressable
          className="absolute top-10 right-5 z-10"
          onPress={() => setSelectedImage(null)}
        >
          <Ionicons name="close" size={30} color="white" />
        </Pressable>
        <Image
          source={{ uri: selectedImage }}
          style={{ width: "100%", height: "70%" }}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );

  const renderMessageItem = ({ item }) => {
    if (item?.content?.text === " ") {
      return null;
    }

    const isOwn = item?.sender?.role === "provider";
    const messageMedia = item?.content?.media || [];
    const messageText = item?.content?.text || "";

    // console.log("mes", messageMedia[0]?.url);
    return (
      <View className={`mb-[4%] ${isOwn ? "items-end" : "items-start"}`}>
        <View
          className={`max-w-[75%] rounded-2xl overflow-hidden ${
            messageMedia.length > 0 && isOwn
              ? "bg-[#319FCA] rounded-br-md"
              : isOwn
                ? "bg-[#319FCA] rounded-br-md"
                : "bg-[#f9f9f9] rounded-bl-md shadow-sm"
          }`}
        >
          {/* Media Section */}
          {messageMedia.length > 0 && (
            <View className="flex-row flex-wrap">
              {messageMedia.map((media, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedImage(media.url)}
                  activeOpacity={0.7}
                >
                  <View className="relative" style={{ margin: scale(4) }}>
                    <Image
                      source={{ uri: media.url }}
                      style={{
                        width:
                          screenWidth *
                          (messageMedia.length === 1 ? 0.6 : 0.28),
                        height: screenWidth * 0.4,
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Modal render */}
          {selectedImage && <ImageModal />}

          {/* Text Section */}
          {messageText && messageText !== " " && (
            <View className={`px-4 py-3 ${messageMedia.length > 0 ? "" : ""}`}>
              <Text
                className={`text-base ${isOwn ? "text-white" : "text-[#111]"}`}
              >
                {messageText}
              </Text>
            </View>
          )}
        </View>

        <Text className="text-xs text-gray-500 mt-1 mx-1">
          {formatedDate(item?.createdAt)}
        </Text>
      </View>
    );
  };

  if (chatLoader) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#18649F" />
        <Text className="mt-4 text-gray-500">Loading chat...</Text>
      </View>
    );
  }

  const { profilePhoto, fullName, isOnline, lastActive } =
    singleChatHistory?.data?.messages[0]?.sender || {};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingTop: Platform.OS === "android" ? 10 : 0,
        }}
      >
        <ChatHeader
          userData={{
            name: fullName,
            isOnline,
            profilePhoto: profilePhoto?.url,
            lastActive,
          }}
        />

        <View style={{ flex: 1 }}>
          <FlatList
            // ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item, index) => item._id || `message-${index}`}
            contentContainerStyle={{
              padding: scale(16),
              paddingBottom: verticalScale(20),
            }}
            onContentSizeChange={scrollToBottom}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="none"
            keyboardShouldPersistTaps="always"
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
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
        </View>

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          selectedMedia={selectedMedia}
          removeSelectedMedia={removeSelectedMedia}
          showMediaModal={showMediaModal}
          setShowMediaModal={setShowMediaModal}
          selectFromLibrary={selectFromLibrary}
          takePhoto={takePhoto}
          sendMessage={sendMessage}
          handleTypingStart={handleTypingStart}
          handleTypingStop={handleTypingStop}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProviderChatScreen;
