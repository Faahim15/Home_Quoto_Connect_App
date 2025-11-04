import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { scale, verticalScale } from "../components/adaptive/Adaptiveness";
import ChatHeader from "../components/tabs/chat/ChatHeader";
import MessageInput from "../components/tabs/chat/MessageInput";
import { io } from "socket.io-client";
const { width: screenWidth } = Dimensions.get("window");

const ChatScreen = ({ route, navigation }) => {
  // Sample data for demonstration - moved to initial state

  const socket = io("http://localhost:3000");

  const sampleMessages = [
    {
      id: "1",
      text: "Cras eget placerat diam. Aliquam mauris libero, tempor vel nisl non, suscipit.",
      timestamp: "09:55 am",
      isOwn: false,
      isRead: true,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=faces",
    },
    {
      id: "2",
      text: "Sed ac ante dolor. Mauris nec arcu vitae felis pharetra molestie vitae a nibh.",
      timestamp: "09:57 am",
      isOwn: true,
      isRead: true,
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=faces",
    },
    {
      id: "3",
      text: "Duis elementum quam eu tristique sagittis. Justo justo vulputate?",
      timestamp: "09:58 am",
      isOwn: false,
      isRead: true,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=faces",
    },
    {
      id: "4",
      text: "Integer mauris nibh, tristique fringilla?",
      timestamp: "10:00 am",
      isOwn: true,
      isRead: false,
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=faces",
    },
  ];

  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const flatListRef = useRef(null);

  // Get user data from navigation params or set default
  const userData = route?.params?.userData || {
    name: "Jhonson",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=faces",
    status: "Active Now",
    userId: "user_123",
  };

  const requestPermissions = async () => {
    try {
      // Request camera permissions
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== "granted") {
        console.log("Camera permission not granted");
      }

      // Request media library permissions
      const mediaPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaPermission.status !== "granted") {
        console.log("Media library permission not granted");
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  };

  // Media selection functions
  const selectFromLibrary = async () => {
    try {
      // ✅ Step 1: Request permission only when needed
      setShowMediaModal(false);
      const mediaPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaPermission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your media library."
        );
        return; // Stop if not granted
      }

      // ✅ Step 2: Correct usage of mediaTypes (use ImagePicker constant)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 4,
        videoMaxDuration: 30,
      });

      // ✅ Step 3: Handle the selected media
      if (!result.canceled && result.assets && result.assets.length > 0) {
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
        setSelectedMedia(mediaArray); // Set array of media
      }
    } catch (error) {
      console.error("Error selecting from library:", error);
      Alert.alert("Error", "Failed to select media from library");
    }
  };

  const takePhoto = async () => {
    try {
      setShowMediaModal(false);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images", "videos", "livePhotos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
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
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const recordVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images", "videos", "livePhotos"],
        allowsEditing: true,
        quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
        videoMaxDuration: 120, // 30 seconds max
      });
      setShowMediaModal(false);
      if (!result.canceled && result.assets && result.assets[0]) {
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
    } catch (error) {
      console.error("Error recording video:", error);
      Alert.alert("Error", "Failed to record video");
    }
  };

  const removeSelectedMedia = (index = null) => {
    if (index !== null) {
      // Remove specific item
      setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Clear all
      setSelectedMedia([]);
    }
  };

  // Send message function
  const sendMessage = () => {
    // Check if there's media or text to send
    if (!newMessage.trim() && selectedMedia.length === 0) return;

    const messageData = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
      isRead: false,
      media: selectedMedia.length > 0 ? selectedMedia : null,
    };

    // Add message to local state immediately for better UX
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
    setSelectedMedia([]);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Handle typing indicator
  const handleTypingStart = () => {
    // if (isConnected) {
    //   socketRef.current.emit('typing', {
    //     recipientId: userData.userId,
    //     userId: 'current_user_id',
    //   });
    // }
  };

  const handleTypingStop = () => {
    // if (isConnected) {
    //   socketRef.current.emit('stopTyping', {
    //     recipientId: userData.userId,
    //     userId: 'current_user_id',
    //   });
    // }
  };

  const displayMessages = messages.length > 0 ? messages : sampleMessages;

  const renderMessageItem = ({ item }) => (
    <View className={`mb-[4%] ${item.isOwn ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[75%] rounded-2xl overflow-hidden ${
          item.isOwn
            ? "bg-[#319FCA] rounded-br-md"
            : "bg-white rounded-bl-md shadow-sm"
        }`}
      >
        {/* Render media if exists */}
        {item.media && Array.isArray(item.media) && (
          <View className="flex-wrap bg-[#fff] flex-row">
            {item.media.map((mediaItem, index) => (
              <View
                style={{
                  marginVertical: verticalScale(8),
                  marginHorizontal: scale(8),
                }}
                key={index}
                className="relative "
              >
                {mediaItem.type === "image" ? (
                  <Image
                    className="border border-[#fff] rounded-md "
                    source={{ uri: mediaItem.uri }}
                    style={{
                      width:
                        item.media.length === 1
                          ? screenWidth * 0.6
                          : screenWidth * 0.28,
                      height:
                        item.media.length === 1
                          ? screenWidth *
                            0.6 *
                            (mediaItem.height / mediaItem.width)
                          : screenWidth * 0.28,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width:
                        item.media.length === 1
                          ? screenWidth * 0.6
                          : screenWidth * 0.28,
                      height:
                        item.media.length === 1
                          ? verticalScale(150)
                          : screenWidth * 0.28,
                    }}
                    className="bg-gray-200 items-center justify-center"
                  >
                    <Ionicons name="play-circle" size={32} color="#319FCA" />
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Render text if exists */}
        {item.text ? (
          <View className="px-4 py-3">
            <Text
              className={`font-poppins-400regular text-base leading-5 ${
                item.isOwn ? "text-white" : "text-gray-800"
              }`}
            >
              {item.text}
            </Text>
          </View>
        ) : null}
      </View>
      <Text className="font-poppins-400regular text-xs text-gray-500 mt-[1%] mx-[1%]">
        {item.timestamp}
      </Text>
    </View>
  );

  // Force KeyboardAvoidingView update when media changes
  useEffect(() => {
    if (Platform.OS === "ios") {
      // This forces KeyboardAvoidingView to recalculate
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [selectedMedia.length]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* <StatusBar barStyle="dark-content" backgroundColor="#ffffff" /> */}

      <KeyboardAvoidingView
        key={selectedMedia.length} // Forces re-render when media changes
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={
          Platform.OS === "ios"
            ? selectedMedia.length > 0
              ? -30
              : 0 // Adjust offset when media is present
            : 20
        }
        enabled={true}
      >
        {/* Header */}
        <ChatHeader userData={userData} />

        {/* Messages List */}
        <View className="flex-1">
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              padding: scale(16),
              paddingBottom: verticalScale(20), // Reduced padding
            }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={scrollToBottom}
            keyboardShouldPersistTaps="handled"
          />

          {/* Typing Indicator */}
          {isTyping && (
            <View className="px-[4%] pb-2">
              <View className="bg-white rounded-2xl rounded-bl-md px-4 py-3 max-w-[75%] shadow-sm">
                <Text className="text-gray-500 text-sm">
                  {userData.name} is typing...
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Message Input - Now properly positioned */}
        <View>
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
