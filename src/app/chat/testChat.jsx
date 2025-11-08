import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RealTimeTestScreen = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState("");
  const [providerId, setProviderId] = useState("6991b42675235a2ff2d266a6"); // আপনার Provider ID
  const [isLoading, setIsLoading] = useState(false);

  // All received events log
  const [eventsLog, setEventsLog] = useState([]);

  const addToLog = (eventName, data) => {
    const logEntry = {
      id: Date.now(),
      event: eventName,
      data: JSON.stringify(data).substring(0, 150),
      timestamp: new Date().toLocaleTimeString(),
      type: "received",
    };
    setEventsLog((prev) => [logEntry, ...prev].slice(0, 20));
  };

  // 1. Socket Initialization
  const initializeSocket = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      if (!token) {
        Alert.alert("Error", "Token not found");
        return;
      }

      console.log("🔄 Initializing socket...");

      const newSocket = io("http://10.10.20.30:5000", {
        transports: ["websocket"],
        auth: { token },
      });

      // Connection Events
      newSocket.on("connect", () => {
        console.log("✅ CONNECTED - Socket ID:", newSocket.id);
        setIsConnected(true);
        setSocketId(newSocket.id);
        addToLog("connect", { socketId: newSocket.id });

        // User Identify
        if (userId) {
          newSocket.emit("user-join", userId);
          addToLog("user-join emitted", { userId });
        }

        // Join notifications
        newSocket.emit("join-notifications", userId);
        addToLog("join-notifications emitted", { userId });
      });

      newSocket.on("disconnect", (reason) => {
        console.log("❌ DISCONNECTED:", reason);
        setIsConnected(false);
        addToLog("disconnect", { reason });
      });

      newSocket.on("connect_error", (error) => {
        console.log("🚨 CONNECT ERROR:", error.message);
        addToLog("connect_error", { error: error.message });
      });

      // 📨 MESSAGE EVENTS - এখানে Real-time Message Receive হবে
      newSocket.on("new-message", (message) => {
        console.log("📩 NEW-MESSAGE EVENT:", message);
        addToLog("new-message", message);

        // UI তে Message Show করুন
        setMessages((prev) => [
          ...prev,
          {
            id: message._id || Date.now(),
            text: message.content?.text || message.content || "No text",
            type: "received",
            timestamp: new Date().toLocaleTimeString(),
            from: "Provider",
          },
        ]);

        Alert.alert(
          "📩 New Message Received!",
          message.content?.text || message.content
        );
      });

      // 🎯 DEBUG: Catch ALL events
      newSocket.onAny((eventName, ...args) => {
        console.log(`🎯 ALL-EVENTS - ${eventName}:`, args);
        addToLog(`ANY: ${eventName}`, args);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error("🚨 Initialization error:", error);
      Alert.alert("Error", "Failed to initialize socket");
    }
  };

  // 2. Initialize Chat (প্রথম বার চ্যাট শুরু করতে)
  const initializeChat = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "Token not found");
        return;
      }

      console.log("🚀 Initializing chat with provider:", providerId);

      // 🔵 EXACTLY আপনার Postman এর মতো JSON Format
      const requestBody = {
        providerId: providerId,
        content: " ", // Empty message to initialize
        messageType: "text",
      };

      const response = await fetch("http://10.10.20.30:5000/api/chats/direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log("📡 Chat initialization response:", result);

      if (result.success) {
        const chatData = result.data;
        setChatId(chatData.chat._id);

        // Existing messages লোড করুন
        if (chatData.messages && chatData.messages.length > 0) {
          const formattedMessages = chatData.messages.map((msg) => ({
            id: msg._id,
            text: msg.content?.text || msg.content,
            type: msg.sender?.role === "client" ? "sent" : "received",
            timestamp: new Date(msg.createdAt).toLocaleTimeString(),
            from: msg.sender?.role === "client" ? "You" : "Provider",
          }));
          setMessages(formattedMessages);
        }

        // Socket দিয়ে Chat Room join করুন
        if (socket && isConnected) {
          socket.emit("join-chat", chatData.chat._id);
          addToLog("join-chat emitted", { chatId: chatData.chat._id });
        }

        Alert.alert("Success", `Chat initialized! ID: ${chatData.chat._id}`);
        addToLog("chat-initialized", {
          chatId: chatData.chat._id,
          success: true,
        });
      } else {
        Alert.alert("Error", result.message || "Failed to initialize chat");
        addToLog("chat-error", { error: result.message });
      }
    } catch (error) {
      console.error("🚨 Chat initialization error:", error);
      Alert.alert("Error", "Failed to initialize chat");
      addToLog("chat-exception", { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Send Message - EXACT JSON Format like Postman
  const sendTestMessage = async () => {
    try {
      if (!newMessage.trim()) {
        Alert.alert("Error", "Please enter a message");
        return;
      }

      if (!chatId) {
        Alert.alert("Error", "Please initialize chat first");
        return;
      }

      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");

      // Optimistic UI Update
      const tempMessage = {
        id: Date.now(),
        text: newMessage,
        type: "sent",
        timestamp: new Date().toLocaleTimeString(),
        from: "You",
        isSending: true,
      };
      setMessages((prev) => [...prev, tempMessage]);

      // 🔵 EXACTLY আপনার Postman এর মতো JSON Format
      const requestBody = {
        providerId: providerId,
        content: newMessage,
        messageType: "text",
      };

      console.log("📤 Sending message:", requestBody);

      const response = await fetch("http://10.10.20.30:5000/api/chats/direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log("📡 Send message response:", result);

      if (result.success) {
        console.log("✅ Message saved via REST API");

        // Remove temporary message and add confirmed message
        setMessages((prev) =>
          prev
            .filter((msg) => !msg.isSending)
            .concat({
              id: result.data.message._id || Date.now(),
              text: newMessage,
              type: "sent",
              timestamp: new Date().toLocaleTimeString(),
              from: "You",
            })
        );

        addToLog("message-sent-api", {
          success: true,
          message: newMessage,
          messageId: result.data.message._id,
        });

        setNewMessage("");

        // Socket দিয়ে Real-time Event (যদি প্রয়োজন হয়)
        if (socket && isConnected) {
          socket.emit("send-message", {
            chatId: chatId,
            content: newMessage,
            messageType: "text",
          });
          addToLog("send-message emitted", { content: newMessage });
        }
      } else {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((msg) => !msg.isSending));
        Alert.alert("API Error", result.message || "Failed to send message");
        addToLog("message-send-error", { error: result.message });
      }
    } catch (error) {
      console.error("🚨 Send error:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => !msg.isSending));
      Alert.alert("Error", "Failed to send message");
      addToLog("message-send-exception", { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Test Typing Indicators
  const testTyping = () => {
    if (socket && isConnected && chatId) {
      socket.emit("typing-start", { chatId });
      addToLog("typing-start emitted", { chatId });

      setTimeout(() => {
        socket.emit("typing-stop", { chatId });
        addToLog("typing-stop emitted", { chatId });
      }, 3000);

      Alert.alert("⌨️ Typing", "Typing indicators sent for 3 seconds");
    } else {
      Alert.alert("Error", "Socket not connected or chat not initialized");
    }
  };

  // 5. Cleanup
  const cleanup = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setSocketId("");
      Alert.alert("Info", "Socket disconnected");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f5f5f5" }}>
      {/* Connection Status */}
      <View
        style={{
          padding: 12,
          backgroundColor: isConnected ? "#4CAF50" : "#F44336",
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          {isConnected ? "🟢 CONNECTED" : "🔴 DISCONNECTED"}
        </Text>
        <Text style={{ color: "white", fontSize: 12 }}>
          Socket: {socketId || "Not connected"} | Chat: {chatId ? "✅" : "❌"}
        </Text>
      </View>

      {/* Control Buttons */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#2196F3",
            padding: 12,
            borderRadius: 8,
            minWidth: 100,
          }}
          onPress={initializeSocket}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Connect Socket
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#FF9800",
            padding: 12,
            borderRadius: 8,
            minWidth: 100,
          }}
          onPress={initializeChat}
          disabled={!isConnected || isLoading}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            {isLoading ? "..." : "Init Chat"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#9C27B0",
            padding: 12,
            borderRadius: 8,
            minWidth: 100,
          }}
          onPress={testTyping}
          disabled={!isConnected || !chatId}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Test Typing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#F44336",
            padding: 12,
            borderRadius: 8,
            minWidth: 100,
          }}
          onPress={cleanup}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Disconnect
          </Text>
        </TouchableOpacity>
      </View>

      {/* Message Input */}
      <View style={{ marginBottom: 16 }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "white",
            marginBottom: 8,
          }}
          placeholder="Type your message here..."
          value={newMessage}
          onChangeText={setNewMessage}
          editable={!isLoading && chatId}
        />
        <TouchableOpacity
          style={{
            backgroundColor: chatId ? "#4CAF50" : "#9E9E9E",
            padding: 12,
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
          onPress={sendTestMessage}
          disabled={!isConnected || !chatId || isLoading}
        >
          {isLoading && <ActivityIndicator size="small" color="white" />}
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View
        style={{
          backgroundColor: "#E3F2FD",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 12, color: "#1565C0", fontWeight: "bold" }}>
          Provider ID: {providerId}
        </Text>
        <Text style={{ fontSize: 12, color: "#1565C0" }}>
          Chat ID: {chatId || "Not initialized"}
        </Text>
      </View>

      {/* Messages Display */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Messages ({messages.length})
        </Text>
        <ScrollView
          style={{
            flex: 1,
            marginBottom: 16,
            backgroundColor: "white",
            borderRadius: 8,
            padding: 8,
          }}
        >
          {messages.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#666", padding: 20 }}>
              No messages yet. Initialize chat and send a message!
            </Text>
          ) : (
            messages.map((msg) => (
              <View
                key={msg.id}
                style={{
                  padding: 12,
                  marginVertical: 4,
                  backgroundColor: msg.type === "sent" ? "#E3F2FD" : "#F3E5F5",
                  borderRadius: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: msg.type === "sent" ? "#2196F3" : "#9C27B0",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                  {msg.type === "sent" ? "📤 You" : `📥 ${msg.from}`}
                  {msg.isSending && " ⏳"}
                </Text>
                <Text style={{ fontSize: 14, marginVertical: 4 }}>
                  {msg.text}
                </Text>
                <Text style={{ fontSize: 10, color: "#666" }}>
                  {msg.timestamp}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Events Log */}
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Socket Events ({eventsLog.length})
        </Text>
        <ScrollView
          style={{
            height: 150,
            backgroundColor: "white",
            borderRadius: 8,
            padding: 8,
          }}
        >
          {eventsLog.map((event) => (
            <View
              key={event.id}
              style={{
                padding: 6,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Text style={{ fontSize: 10, color: "#666" }}>
                {event.timestamp}
              </Text>
              <Text
                style={{ fontSize: 11, fontWeight: "bold", color: "#1976D2" }}
              >
                {event.event}
              </Text>
              <Text style={{ fontSize: 10, color: "#555" }} numberOfLines={1}>
                {event.data}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default RealTimeTestScreen;
