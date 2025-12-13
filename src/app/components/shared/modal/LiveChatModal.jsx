import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  ActivityIndicator,
  Image,
  StatusBar,
  SafeAreaView,
  Keyboard,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSocket } from "../../../../hooks/useSokect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetSupportTicketMessagesQuery } from "../../../../redux/features/apiSlices/user/userApiSlices";
import * as ImagePicker from "expo-image-picker";
import AttachOptionsModal from "./AttachOptionalModal";
import * as FileSystem from "expo-file-system";
import ImageViewerModal from "./ImageViewerModal";

export default function LiveChatModal({ visible, onClose, ticketId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { socket, isConnected } = useSocket(
    "wss://myqoute-eudjatd9a3f8eua8.southeastasia-01.azurewebsites.net"
  );

  const [currentUserId, setCurrentUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  console.log("show attachments", attachments);

  const {
    data,
    isLoading: messageLoader,
    refetch,
  } = useGetSupportTicketMessagesQuery(ticketId, {
    skip: !ticketId,
  });

  console.log("tikced id", ticketId);

  // Track keyboard height
  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        const keyboardHeight = e.endCoordinates.height;
        setContainerHeight(keyboardHeight);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const hideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setContainerHeight(0);
      }
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // getting userId here
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) setCurrentUserId(userId);
    };
    fetchUserId();
  }, []);

  //receiving the messages
  useEffect(() => {
    if (data?.data?.messages) {
      setMessages(data.data.messages);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [data]);

  //  joinRooms
  useEffect(() => {
    const joinRooms = async () => {
      if (!socket || !ticketId) return;
      socket.emit("join-support-ticket", { ticketId });
    };
    joinRooms();
  }, [socket, ticketId]);

  //  listening to new messages
  const handleNewMessage = (message) => {
    console.log("new messages", message);
    setMessages((prev) => [...prev, message?.data]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleUserTyping = (data) => {
    if (data.userId !== currentUserId) {
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("new-support-message", handleNewMessage);
    socket.on("support-user-typing", handleUserTyping);

    return () => {
      socket.off("new-support-message", handleNewMessage);
      socket.off("support-user-typing", handleUserTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [socket, currentUserId]);

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const selected = result.assets.map((item) => ({
          uri: item.uri,
          type: "image",
          filename: item.fileName || `image_${Date.now()}.jpg`,
        }));
        setAttachments((prev) => [...prev, ...selected]);
      }
    } catch (err) {
      console.log("pick image error", err);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setAttachments((prev) => [
          ...prev,
          {
            uri: asset.uri,
            type: "image",
            filename: `camera_${Date.now()}.jpg`,
          },
        ]);
      }
    } catch (err) {
      console.log("camera error", err);
    }
  };

  const handleSendMessage = async () => {
    // Updated condition: Allow sending if there's either text OR attachments
    if (
      (!inputText.trim() && attachments.length === 0) ||
      !socket ||
      !isConnected
    )
      return;

    const text = inputText.trim();

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    const media = [];
    if (attachments && attachments.length > 0) {
      for (const file of attachments) {
        try {
          const base64 = await FileSystem.readAsStringAsync(file.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          media.push({
            type: file.type,
            filename: file.fileName,
            url: `data:image/jpeg;base64,${base64}`,
          });
        } catch (err) {
          console.error("Error reading file:", err);
          Alert.alert("Error", `Failed to read file: ${file.fileName}`);
        }
      }
    }
    const payload = {
      ticketId,
      content: {
        text: text, // This will be empty string if no text
        attachments: media,
      },
      messageType: attachments.length > 0 ? "image" : "text",
    };

    try {
      socket.emit("support-message", payload);
      setAttachments([]);
      setInputText("");
      refetch();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleTyping = () => {
    if (socket && isConnected)
      socket.emit("support-user-typing", { ticketId, userId: currentUserId });
  };

  const handleImagePress = (imageUrl, allImages, index) => {
    setSelectedImageUrl(imageUrl);
    setSelectedImages(allImages);
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  const renderSystemMessage = (item) => {
    let systemText = "";
    if (item.systemMessageType === "ticket_created")
      systemText = "Ticket created";
    else if (item.systemMessageType === "status_changed")
      systemText = item.content?.text || "Status changed";

    return (
      <View className="items-center my-3 px-4">
        <View className="bg-gray-100 px-4 py-1.5 rounded-xl">
          <Text className="text-gray-500 text-xs text-center">
            {systemText}
          </Text>
          <Text className="text-gray-400 text-[9px] text-center mt-0.5">
            {new Date(item.createdAt).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderMessage = ({ item }) => {
    if (item.systemMessageType) return renderSystemMessage(item);

    const isMyMessage = item.sender?._id === currentUserId;
    const senderName = item.sender?.fullName || "Unknown";
    const senderPhoto = item.sender?.profilePhoto?.url;
    const hasAttachments =
      item.content?.attachments && item.content.attachments.length > 0;
    const isImageMessage = item.messageType === "image";

    return (
      <View
        className={`flex-row ${isMyMessage ? "justify-end" : "justify-start"} my-1.5 px-4`}
      >
        {!isMyMessage && (
          <View className="mr-2 items-center">
            {senderPhoto ? (
              <Image
                source={{ uri: senderPhoto }}
                className="w-9 h-9 rounded-full bg-gray-300"
              />
            ) : (
              <View className="w-9 h-9 rounded-full bg-blue-700 justify-center items-center">
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
            )}
          </View>
        )}

        <View
          className={`max-w-[70%] ${isMyMessage ? "items-end" : "items-start"}`}
        >
          {!isMyMessage && (
            <Text className="text-blue-700 text-[11px] font-medium mb-0.5 ml-1">
              {senderName}
            </Text>
          )}

          <View
            className={`px-3.5 py-2 rounded-xl ${isMyMessage ? "bg-blue-700 rounded-br-[4px]" : "bg-gray-200 rounded-bl-[4px]"} shadow-sm`}
          >
            {/* Text content */}
            {item.content?.text && item.content.text.trim() !== "" && (
              <Text
                className={`${isMyMessage ? "text-white" : "text-gray-800"} text-sm leading-5 mb-2`}
              >
                {item.content.text}
              </Text>
            )}

            {/* Image attachments - Row layout */}
            {hasAttachments && isImageMessage && (
              <View className="flex-row flex-wrap gap-2">
                {item.content.attachments.map((attachment, index) => {
                  const imageUrls = item.content.attachments.map(
                    (att) => att.url
                  );
                  return (
                    <TouchableOpacity
                      key={attachment._id || index}
                      onPress={() =>
                        handleImagePress(attachment.url, imageUrls, index)
                      }
                      activeOpacity={0.8}
                      className="rounded-lg overflow-hidden"
                    >
                      <Image
                        source={{ uri: attachment.url }}
                        className="w-32 h-32 rounded-lg"
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Time and read status */}
            <View className="flex-row items-center justify-end mt-1">
              <Text
                className={`${isMyMessage ? "text-white/70" : "text-gray-400"} text-[10px]`}
              >
                {new Date(item.createdAt || item.timestamp).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                )}
              </Text>
              {isMyMessage && (
                <Ionicons
                  name={item.isRead ? "checkmark-done" : "checkmark"}
                  size={14}
                  color={item.isRead ? "#4CAF50" : "rgba(255,255,255,0.7)"}
                  className="ml-1"
                />
              )}
            </View>
          </View>
        </View>

        {isMyMessage && (
          <View className="ml-2">
            {senderPhoto ? (
              <Image
                source={{ uri: senderPhoto }}
                className="w-9 h-9 rounded-full bg-gray-300"
              />
            ) : (
              <View className="w-9 h-9 rounded-full bg-blue-700 justify-center items-center">
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <View
        className="flex-1 bg-white"
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 bg-blue-700 border-b border-gray-200">
          <TouchableOpacity onPress={onClose} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View className="w-10 h-10 rounded-full bg-white justify-center items-center mr-3">
            <Ionicons name="headset" size={20} color="#0054A5" />
          </View>

          <View className="flex-1">
            <Text className="text-white text-base font-semibold">
              Support Team
            </Text>
            <View className="flex-row items-center">
              <View
                className={`w-2 h-2 rounded-full mr-1.5 ${
                  isConnected ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <Text className="text-gray-200 text-xs">
                {isConnected ? "Active now" : "Connecting..."}
              </Text>
            </View>
          </View>

          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <View className="flex-1" style={{ marginBottom: 0 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => item._id || index.toString()}
            contentContainerStyle={{
              paddingVertical: 16,
              backgroundColor: "#F9FAFB",
              flexGrow: 1,
              paddingBottom: 80,
            }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListFooterComponent={
              isTyping ? (
                <View className="px-4 py-2 bg-gray-50">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-blue-700 justify-center items-center mr-2">
                      <Ionicons name="person" size={16} color="#FFF" />
                    </View>
                    <Text className="text-gray-500 text-xs italic">
                      Support team is typing...
                    </Text>
                  </View>
                </View>
              ) : null
            }
          />
        </View>

        {/* Input */}
        <View className="absolute bottom-0 left-0 border right-0 border-t border-gray-200 bg-white">
          {attachments.length > 0 && (
            <View className="px-4 py-2 flex-row flex-wrap bg-white">
              {attachments.map((file, index) => (
                <View key={index} className="mr-2 mb-2 relative">
                  <Image
                    source={{ uri: file.uri }}
                    className="w-20 h-20 rounded-lg"
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setAttachments((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                  >
                    <Ionicons name="close" color="white" size={14} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View className="flex-row items-center px-4 py-3">
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-2">
              <TextInput
                className="flex-1 text-gray-800 text-sm max-h-24"
                placeholder="Type your message..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={(text) => {
                  setInputText(text);
                  handleTyping();
                }}
                multiline
                onFocus={() => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
              />
              <TouchableOpacity
                className="ml-2"
                onPress={() => setShowAttachModal(true)}
              >
                <Ionicons name="attach" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={
                (!inputText.trim() && attachments.length === 0) || !isConnected
              }
              className={`w-11 h-11 rounded-full justify-center items-center ${
                (inputText.trim() || attachments.length > 0) && isConnected
                  ? "bg-blue-700"
                  : "bg-gray-200"
              }`}
            >
              {messageLoader ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
                  color={
                    (inputText.trim() || attachments.length > 0) && isConnected
                      ? "#FFF"
                      : "#999"
                  }
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <AttachOptionsModal
          visible={showAttachModal}
          onClose={() => setShowAttachModal(false)}
          onCamera={takePhoto}
          onGallery={pickImages}
        />

        {/* Image Viewer Modal */}
        <ImageViewerModal
          visible={imageViewerVisible}
          onClose={() => setImageViewerVisible(false)}
          imageUrl={selectedImageUrl}
          images={selectedImages}
          currentIndex={selectedImageIndex}
        />
      </View>
    </Modal>
  );
}
