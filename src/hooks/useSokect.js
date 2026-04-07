
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSocket = (serverUrl) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("❌ No token found for socket");
          return;
        }

        const newSocket = io(serverUrl, {
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
          console.log("🚨 Socket error:", err.message);
          setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
          newSocket.removeAllListeners();
        };
      } catch (err) {
        console.log("🚨 Error initializing socket:", err);
      }
    };

    initializeSocket();
  }, [serverUrl]);

  return { socket, isConnected };
};
