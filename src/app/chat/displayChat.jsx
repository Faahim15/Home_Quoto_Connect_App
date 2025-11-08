import { useState, useEffect, useRef } from "react";
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
import { useDirectChatMutation } from "../../redux/features/apiSlices/chat/chatApiSlices";
const ChatScreen = ({ route }) => {
  const { providerId } = useLocalSearchParams();
  const { data, isLoading } = useGetProviderDetailsQuery(providerId);
  const { width: screenWidth } = Dimensions.get("window");
  const [socket, setSocket] = useState(null); // Correct socket instance
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const flatListRef = useRef(null);

  const [sendMessageToProvder, { isLoading: chatLoading }] =
    useDirectChatMutation();

  const userData = route?.params?.userData || {
    name: "Jhonson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=faces",
    status: "Active Now",
    userId: "user_123",
  };

  const requestPermissions = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== "granted") {
        console.log("Camera permission not granted");
      }

      const mediaPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaPermission.status !== "granted") {
        console.log("Media library permission not granted");
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  };

  const selectFromLibrary = async () => {
    setShowMediaModal(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: 4,
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
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
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
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      videoMaxDuration: 120,
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
  useEffect(() => {
    const connectSocket = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const newSocket = io("http://10.10.20.30:5000", {
          transports: ["websocket"],
          auth: { token },
        });

        newSocket.on("connect", () =>
          console.log("Socket connected:", newSocket.id)
        );
        newSocket.on("disconnect", (reason) =>
          console.log("Socket disconnected:", reason)
        );
        newSocket.on("connect_error", (err) =>
          console.log("Socket error:", err.message)
        );

        newSocket.on("receive-message", (msg) => {
          setMessages((prev) => [...prev, msg]);
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
      } catch (error) {
        console.log("Socket init error:", error);
      }
    };

    connectSocket();
  }, []);

  // const sendMessage = async () => {
  //   try {
  //     if (!socket) return console.log("Socket not connected");
  //     const chatData = new FormData();
  //     if (newMessage.trim() || selectedMedia.length > 0) {
  //       const message = {
  //         providerId: providerId,
  //         content: "Test direct message",
  //         messageType: "text",
  //       };

  //       chatData.append("providerId", providerId);
  //       chatData.append("content", "Test direct message");
  //       chatData.append("messageType", "text");
  //       console.log("p", providerId);
  //       const res = await sendMessageToProvder(chatData).unwrap();
  //       console.log("Direct messages to provider has sent:", res);
  //       // socket.emit("send-message", message);
  //       // console.log("is message send", message);
  //       setMessages((prev) => [...prev, message]);
  //       setNewMessage("");
  //       setSelectedMedia([]);
  //       scrollToBottom();
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     console.log("providerId", providerId);
  //   }
  // };

  const sendMessage = async () => {
    try {
      if (!socket) return console.log("Socket not connected");
      if (!providerId) return console.log("❌ providerId missing");
      if (!newMessage.trim() && selectedMedia.length === 0) return;

      const message = {
        providerId: providerId, // must be valid
        content: newMessage.trim(),
        messageType: "text",
      };

      console.log("📤 Sending message to backend:", message);

      // Send via socket (if backend supports it)
      // socket.emit("send-message", message);
      const token = await AsyncStorage.getItem("token");
      // (Optional) Send via HTTP if needed
      const response = await fetch(`http://10.10.20.30:5000/api/chats/direct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // if your API requires token
        },
        body: JSON.stringify(message),
      });

      const data = await response.json();
      if (data.success) {
        console.log("✅ Message sent successfully:", data);
        setMessages((prev) => [...prev, data.data.message]);
        setNewMessage("");
      } else {
        console.error("❌ Error sending message:", data);
        Alert.alert("Error", data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("🚨 Exception while sending message:", error);
      Alert.alert("Error", "Something went wrong while sending message.");
    }
  };

  const renderMessageItem = ({ item }) => (
    <View className={`mb-[4%] ${item.isOwn ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[75%] rounded-2xl overflow-hidden ${item.isOwn ? "bg-[#319FCA] rounded-br-md" : "bg-white rounded-bl-md shadow-sm"}`}
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
              />
            ) : (
              <View
                style={{
                  width: screenWidth * (item.media.length === 1 ? 0.6 : 0.28),
                  height: screenWidth * 0.28,
                  backgroundColor: "#ccc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="play-circle" size={32} color="#319FCA" />
              </View>
            )}
          </View>
        ))}
        {item.text && (
          <View className="px-4 py-3">
            <Text
              className={`text-base ${item.isOwn ? "text-white" : "text-gray-800"}`}
            >
              {item.text}
            </Text>
          </View>
        )}
      </View>
      <Text className="text-xs text-gray-500 mt-1 mx-1">{item.timestamp}</Text>
    </View>
  );
  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#18649F" />
        <Text className="mt-4 text-gray-500">Loading provider details...</Text>
      </View>
    );
  }

  const { profilePhoto, fullName, isOnline, lastActive } =
    data?.data?.provider || {};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        key={selectedMedia.length}
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
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            padding: scale(16),
            paddingBottom: verticalScale(20),
          }}
          onContentSizeChange={scrollToBottom}
          keyboardShouldPersistTaps="handled"
        />

        {isTyping && (
          <View className="px-4 pb-2">
            <View className="bg-white rounded-2xl rounded-bl-md px-4 py-3 max-w-[75%] shadow-sm">
              <Text className="text-gray-500 text-sm">
                {userData.name} is typing...
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
          handleTypingStart={() => {}}
          handleTypingStop={() => {}}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
