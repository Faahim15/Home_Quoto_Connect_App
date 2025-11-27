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
import { scale, verticalScale } from "../../adaptive/Adaptiveness";
import { useSocket } from "../../../../hooks/useSokect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSendSupportMessageMutation } from "../../../../redux/features/apiSlices/user/userApiSlices";

export default function LiveChatModal({ visible, onClose, ticketId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const { socket, isConnected } = useSocket("http://10.10.20.30:5000");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [sendSupportMessage, { isLoading }] = useSendSupportMessageMutation();

  console.log("tickedId", ticketId);

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) setCurrentUserId(userId);
    };
    fetchUserId();
  }, []);

  // Join rooms when socket is ready
  useEffect(() => {
    const joinRooms = async () => {
      if (!socket || !isConnected || !currentUserId || !ticketId) return;

      console.log("sender User Id:", currentUserId);

      // 1️⃣ Personal room
      socket.emit("user-join", currentUserId);

      // 2️⃣ Notifications room
      socket.emit("join-notifications", currentUserId);

      // 3️⃣ Chat room
      console.log("🎯 Joining chat room:", ticketId);
      socket.emit("join-chat", ticketId);
    };

    joinRooms();
  }, [socket, isConnected, currentUserId, ticketId]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    const handleNewMessage = (message) => {
      console.log("📩 New message received:", message);
      setMessages((prev) => [...prev, message]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    // Listen for typing indicator
    const handleUserTyping = (data) => {
      console.log("⌨️ User typing:", data);
      if (data.userId !== currentUserId) {
        setIsTyping(true);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    // Attach listeners
    socket.on("new-message", handleNewMessage);
    socket.on("user-typing", handleUserTyping);

    // Cleanup
    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleUserTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, currentUserId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !socket || !isConnected) return;

    const text = inputText.trim();

    console.log("see text", text);

    const localMessage = {
      _id: Date.now().toString(),
      sender: { _id: currentUserId },
      content: { text },
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, localMessage]);

    setInputText("");

    // Scroll down
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // 1️⃣ Send to API (database save)
      await sendSupportMessage({
        ticketId,
        messageType: "text",
        content: text || "",
      }).unwrap();

      // 2️⃣ Emit through socket (realtime)
      // socket.emit("send-message", {
      //   chatId: ticketId,
      //   senderId: currentUserId,
      //   text,
      //   timestamp: new Date().toISOString(),
      // });
    } catch (error) {
      console.log("❌ Message Send Failed:", error);

      // You may show toast here later
    }
  };

  const handleTyping = () => {
    if (socket && isConnected) {
      socket.emit("typing", { ticketId, userId: currentUserId });
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender?._id === currentUserId;

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: isMyMessage ? "flex-end" : "flex-start",
          marginVertical: verticalScale(4),
          paddingHorizontal: scale(16),
        }}
      >
        {!isMyMessage && (
          <View
            style={{
              width: scale(32),
              height: scale(32),
              borderRadius: scale(16),
              backgroundColor: "#E0E0E0",
              marginRight: scale(8),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="person" size={scale(18)} color="#666" />
          </View>
        )}

        <View
          style={{
            maxWidth: "70%",
            backgroundColor: isMyMessage ? "#0054A5" : "#F0F0F0",
            paddingHorizontal: scale(12),
            paddingVertical: verticalScale(8),
            borderRadius: scale(16),
            borderBottomRightRadius: isMyMessage ? scale(4) : scale(16),
            borderBottomLeftRadius: isMyMessage ? scale(16) : scale(4),
          }}
        >
          <Text
            style={{
              color: isMyMessage ? "#FFF" : "#333",
              fontSize: scale(14),
              fontFamily: "Poppins-Regular",
            }}
          >
            {item.content?.text || item.text}
          </Text>
          <Text
            style={{
              color: isMyMessage ? "#E0E0E0" : "#999",
              fontSize: scale(10),
              marginTop: verticalScale(2),
              fontFamily: "Poppins-Regular",
            }}
          >
            {new Date(item.createdAt || item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(12),
            paddingTop: verticalScale(50),
            backgroundColor: "#0054A5",
            borderBottomWidth: 1,
            borderBottomColor: "#E0E0E0",
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{ marginRight: scale(12) }}
          >
            <Ionicons name="arrow-back" size={scale(24)} color="#FFF" />
          </TouchableOpacity>

          <View
            style={{
              width: scale(40),
              height: scale(40),
              borderRadius: scale(20),
              backgroundColor: "#FFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: scale(12),
            }}
          >
            <Ionicons name="headset" size={scale(20)} color="#0054A5" />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: scale(16),
                fontFamily: "Poppins-SemiBold",
                color: "#FFF",
              }}
            >
              Support Team
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: scale(8),
                  height: scale(8),
                  borderRadius: scale(4),
                  backgroundColor: isConnected ? "#4CAF50" : "#999",
                  marginRight: scale(6),
                }}
              />
              <Text
                style={{
                  fontSize: scale(12),
                  fontFamily: "Poppins-Regular",
                  color: "#E0E0E0",
                }}
              >
                {isConnected ? "Active now" : "Connecting..."}
              </Text>
            </View>
          </View>

          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={scale(20)} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Messages Area */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          {messages.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: scale(40),
              }}
            >
              <View
                style={{
                  width: scale(100),
                  height: scale(100),
                  borderRadius: scale(50),
                  backgroundColor: "#F5F5F5",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: verticalScale(16),
                }}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={scale(50)}
                  color="#CCC"
                />
              </View>
              <Text
                style={{
                  fontSize: scale(16),
                  fontFamily: "Poppins-Regular",
                  color: "#999",
                  textAlign: "center",
                }}
              >
                Start your message
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => item._id || index.toString()}
              contentContainerStyle={{
                paddingVertical: verticalScale(16),
              }}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
          )}

          {isTyping && (
            <View
              style={{
                paddingHorizontal: scale(16),
                paddingVertical: verticalScale(8),
              }}
            >
              <Text
                style={{
                  fontSize: scale(12),
                  fontFamily: "Poppins-Regular",
                  color: "#999",
                  fontStyle: "italic",
                }}
              >
                Support is typing...
              </Text>
            </View>
          )}

          {/* Input Area */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: scale(16),
              paddingVertical: verticalScale(12),
              borderTopWidth: 1,
              borderTopColor: "#E0E0E0",
              backgroundColor: "#FFF",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F5F5F5",
                borderRadius: scale(24),
                paddingHorizontal: scale(16),
                paddingVertical: verticalScale(8),
                marginRight: scale(8),
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  fontSize: scale(14),
                  fontFamily: "Poppins-Regular",
                  color: "#333",
                  maxHeight: verticalScale(100),
                }}
                placeholder="Type something..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={(text) => {
                  setInputText(text);
                  handleTyping();
                }}
                multiline
              />
              <TouchableOpacity style={{ marginLeft: scale(8) }}>
                <Ionicons name="attach" size={scale(20)} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!inputText.trim() || !isConnected}
              style={{
                width: scale(44),
                height: scale(44),
                borderRadius: scale(22),
                backgroundColor:
                  inputText.trim() && isConnected ? "#0054A5" : "#E0E0E0",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="send"
                size={scale(20)}
                color={inputText.trim() && isConnected ? "#FFF" : "#999"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
