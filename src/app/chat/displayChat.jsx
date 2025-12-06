import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
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
import { Modal } from "react-native";

const ChatScreen = () => {
  const { providerId } = useLocalSearchParams();
  const { data, isLoading } = useGetProviderDetailsQuery(providerId);
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const { socket, isConnected } = useSocket(
    "wss://myqoute-eudjatd9a3f8eua8.southeastasia-01.azurewebsites.net"
  );
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { data: chatData, isLoading: allChatLoader } = useGetChatsQuery();

  const [createDirectChat, { isLoading: directChatLoader }] =
    useDirectChatMutation();

  const [isTyping, setIsTyping] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [chatId, setChatId] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
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
      socket.emit("user-join", currentUserId);
      socket.emit("join-notifications", currentUserId);
      socket.emit("join-chat", chatId);
    };

    joinRooms();
  }, [socket, isConnected, currentUserId, chatId]);

  // 🧩 Find provider chat when chatData or providerId changes
  useEffect(() => {
    if (chatData?.data?.chats?.length && providerId) {
      const providerChat = chatData.data.chats.find((chat) =>
        chat?.participants?.some((p) => p?.user?._id === providerId)
      );

      if (providerChat?._id) {
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
      const mediaPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (
        cameraPermission.status !== "granted" ||
        mediaPermission.status !== "granted"
      ) {
        Alert.alert(
          "Permission Required",
          "Camera and media library permissions are needed to send photos"
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

    console.log("✍️ Typing started...");
    socket.emit("typing-start", { chatId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

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
  const handleNewMessage = useCallback((data) => {
    console.log("📩 New message received:", data);
    setMessages((prev) => {
      const exists = prev.some((m) => m._id === data._id);
      if (exists) return prev;
      return [...prev, data];
    });
    scrollToBottom();
  }, []);

  // Socket listener for new messages
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, isConnected]);

  // console.log("singleChat", singleChatHistory);

  const sendMessage = async () => {
    // don't send empty message + no media
    const textTrimmed = (newMessage || "").trim();
    if (!textTrimmed && (!selectedMedia || selectedMedia.length === 0)) return;

    // 🆕 If no chatId, create direct chat first
    if (!chatId && providerId) {
      try {
        const formData = new FormData();

        formData.append("providerId", providerId);
        formData.append("content", textTrimmed);
        formData.append(
          "messageType",
          selectedMedia && selectedMedia.length > 0 ? "image" : "text"
        );

        // Convert images to base64 and append
        if (selectedMedia && selectedMedia.length > 0) {
          for (const file of selectedMedia) {
            try {
              // Read file as base64
              const base64 = await FileSystem.readAsStringAsync(file.uri, {
                encoding: FileSystem.EncodingType.Base64,
              });

              // Append as file with base64 data
              formData.append("media", {
                uri: `data:image/jpeg;base64,${base64}`,
                type: "image/jpeg",
                name: file.fileName,
              });
            } catch (err) {
              console.error("Error reading file:", err);
            }
          }
        }

        console.log("Creating direct chat with formData");
        const response = await createDirectChat(formData).unwrap();

        if (response?.data?.chat?._id) {
          const newChatId = response.data.chat._id;
          setChatId(newChatId);
          console.log("✅ Direct chat created with ID:", newChatId);

          // Add the new message to the messages array
          if (response?.data?.message) {
            setMessages((prev) => [...prev, response.data.message]);
          }
        }

        setNewMessage("");
        setSelectedMedia([]);
        handleTypingStop && handleTypingStop();
        scrollToBottom();
        return;
      } catch (error) {
        console.error("❌ Failed to create direct chat:", error);
        Alert.alert("Error", "Failed to send message. Please try again.");
        return;
      }
    }

    // Normal message sending with existing chatId
    // Build media array with base64 data
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
      text: textTrimmed,
      media: media,
    };

    const payload = {
      chatId,
      content,
      messageType: selectedMedia && selectedMedia.length > 0 ? "image" : "text",
    };

    // console.log(
    //   "Emitting send-message payload with media:",
    //   media.length > 0 ? "has base64 data" : "no media"
    // );

    if (socket && isConnected) {
      socket.emit("send-message", payload);
      setNewMessage("");
      setSelectedMedia([]);
      handleTypingStop && handleTypingStop();
      scrollToBottom();
    } else {
      console.warn("Socket not connected — cannot send message");
      Alert.alert("Error", "Connection lost. Please check your internet.");
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
        <TouchableOpacity
          className="absolute top-10 right-5 z-10"
          onPress={() => setSelectedImage(null)}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
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

    const isOwn = item?.sender?.role === "client";
    const messageMedia = item?.content?.media || [];
    const messageText = item?.content?.text || "";

    // console.log("show", messageMedia, messageText);

    return (
      <View className={`mb-[4%] ${isOwn ? "items-end" : "items-start"}`}>
        <View
          className={`max-w-[75%] rounded-2xl overflow-hidden ${
            messageMedia.length > 0 && isOwn
              ? "bg-[#319FCA] rounded-br-md"
              : isOwn
                ? "bg-[#319FCA] rounded-br-md"
                : "bg-white rounded-bl-md shadow-sm"
          }`}
        >
          {/* Media Section */}
          {messageMedia.length > 0 && (
            <View className="flex-row flex-wrap">
              {messageMedia.map((media, index) => (
                <TouchableOpacity
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
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Modal render */}
          {selectedImage && <ImageModal />}

          {/* Text Section */}
          {messageText && messageText !== " " && (
            <View className={`px-4 py-3 ${messageMedia.length > 0 ? "" : ""}`}>
              <Text
                className={`text-base  ${isOwn ? "text-white" : "text-[#111]"} `}
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

  if (isLoading || allChatLoader) {
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
            ref={flatListRef}
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

export default ChatScreen;
