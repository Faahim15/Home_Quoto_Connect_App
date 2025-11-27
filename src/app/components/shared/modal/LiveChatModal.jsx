import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSocket } from "../../../../hooks/useSokect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useGetSupportTicketMessagesQuery,
  useSendSupportMessageMutation,
} from "../../../../redux/features/apiSlices/user/userApiSlices";

export default function LiveChatModal({ visible, onClose, ticketId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const { socket, isConnected } = useSocket("http://10.10.20.30:5000");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [sendSupportMessage, { isLoading }] = useSendSupportMessageMutation();

  const {
    data,
    isLoading: messageLoader,
    refetch,
  } = useGetSupportTicketMessagesQuery(ticketId, {
    skip: !ticketId,
  });

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
      if (!socket || !isConnected || !currentUserId || !ticketId) return;

      socket.emit("user-join", currentUserId);
      socket.emit("join-notifications", currentUserId);
      socket.emit("join-chat", ticketId);
    };
    joinRooms();
  }, [socket, isConnected, currentUserId, ticketId]);

  //  listening to new messages

  const handleNewMessage = (message) => {
    console.log("new messages", message);
    setMessages((prev) => [...prev, message]);

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

    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleUserTyping);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleUserTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [socket, currentUserId]);

  //  listening to new messages end here

  const handleSendMessage = async () => {
    if (!inputText.trim() || !socket || !isConnected) return;

    const text = inputText.trim();
    const localMessage = {
      _id: Date.now().toString(),
      sender: { _id: currentUserId },
      content: { text },
      createdAt: new Date().toISOString(),
      senderRole: "user",
      messageType: "text",
    };

    setMessages((prev) => [...prev, localMessage]);
    setInputText("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      await sendSupportMessage({
        ticketId,
        messageType: "text",
        content: text,
      }).unwrap();
      refetch();
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg._id !== localMessage._id));
    }
    socket.emit("send-message", {
      ticketId, //chatId: ticketId
      content: text,
      messageType: "text",
    });
  };

  const handleTyping = () => {
    if (socket && isConnected)
      socket.emit("typing", { ticketId, userId: currentUserId });
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
            <Text
              className={`${isMyMessage ? "text-white" : "text-gray-800"} text-sm leading-5`}
            >
              {item.content?.text || item.text}
            </Text>
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

  //   const renderDateSeparator = (date) => {
  //     const isToday = new Date(date).toDateString() === new Date().toDateString();
  //     const isYesterday =
  //       new Date(date).toDateString() ===
  //       new Date(Date.now() - 86400000).toDateString();
  //     const dateText = isToday
  //       ? "Today"
  //       : isYesterday
  //         ? "Yesterday"
  //         : new Date(date).toLocaleDateString([], {
  //             month: "short",
  //             day: "numeric",
  //             year: "numeric",
  //           });

  //     return (
  //       <View className="items-center my-4">
  //         <View className="bg-blue-100 px-4 py-1.5 rounded-xl">
  //           <Text className="text-blue-700 text-sm font-medium">{dateText}</Text>
  //         </View>
  //       </View>
  //     );
  //   };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust header height here
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 pt-12 bg-blue-700 border-b border-gray-200 z-50">
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
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={{
            paddingVertical: 16,
            paddingBottom: 100,
            backgroundColor: "#F9FAFB",
          }}
          keyboardShouldPersistTaps="handled" // Important for tapping on messages while keyboard open
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {isTyping && (
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
        )}

        {/* Input */}
        <View className="flex-row items-center px-4 py-3 border-t border-gray-200 bg-white">
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
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
            <TouchableOpacity className="ml-2">
              <Ionicons name="attach" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim() || !isConnected || isLoading}
            className={`w-11 h-11 rounded-full justify-center items-center ${
              inputText.trim() && isConnected && !isLoading
                ? "bg-blue-700"
                : "bg-gray-200"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() && isConnected ? "#FFF" : "#999"}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
