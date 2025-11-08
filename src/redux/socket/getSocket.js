import { io } from "socket.io-client";

const SOCKET_URL = "http://10.10.20.30:5000";

let socket = null;

export const initiateSocket = (token) => {
  try {
    if (socket) {
      console.warn("Socket is already initialized");
      return socket;
    }

    if (!token) {
      throw new Error("Token is required to initialize socket");
    }

    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from Socket.IO server:", reason);
    });

    socket.on("connect_error", (error) => {
      console.warn("Connection Error:", error.message);
    });

    socket.on("connect_timeout", () => {
      console.warn("Connection Timeout");
    });

    socket.on("reconnect_failed", () => {
      console.warn("Reconnection Failed");
    });

    socket.on("error", (error) => {
      console.warn("Socket Error:", error.message);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("Reconnected to server. Attempt:", attemptNumber);
    });

    socket.on("reconnecting", (attemptNumber) => {
      console.log("Attempting to reconnect. Attempt:", attemptNumber);
    });

    return socket;
  } catch (error) {
    console.error("Error initializing socket:", error.message);
    throw error;
  }
};

export const disconnectSocket = () => {
  try {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log("Socket disconnected successfully");
    } else {
      console.warn("No socket to disconnect");
    }
  } catch (error) {
    console.error("Error disconnecting socket:", error.message);
    throw error;
  }
};

export const getSocket = () => {
  try {
    if (!socket) {
      console.warn("Socket is not initialized");
      return null;
    }
    return socket;
  } catch (error) {
    console.error("Error getting socket:", error.message);
    return null;
  }
};

// Additional utility functions
export const isSocketConnected = () => {
  try {
    return socket && socket.connected;
  } catch (error) {
    console.error("Error checking socket connection:", error.message);
    return false;
  }
};

export const reconnectSocket = (token) => {
  try {
    disconnectSocket();
    return initiateSocket(token);
  } catch (error) {
    console.error("Error reconnecting socket:", error.message);
    throw error;
  }
};
