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
          return;
        }

        const newSocket = io(serverUrl, {
          transports: ["websocket"],
          auth: { token },
        });

        newSocket.on("connect", () => {
          setIsConnected(true);
        });

        newSocket.on("disconnect", (reason) => {
          setIsConnected(false);
        });

        newSocket.on("connect_error", (err) => {
          setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
          newSocket.disconnect();
          newSocket.removeAllListeners();
        };
      } catch (err) {}
    };

    initializeSocket();
  }, [serverUrl]);

  return { socket, isConnected };
};
