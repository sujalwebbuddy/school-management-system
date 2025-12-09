import React, { createContext, useContext, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addMessage, setSocketConnected } from "../../../slices/chatSlice";

const SocketContext = createContext();

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    if (!socketRef.current) {
      const host = process.env.REACT_APP_API_HOST || "http://localhost:4000";
      console.log("Initializing socket connection to:", host);

      socketRef.current = io(host, {
        transports: ['websocket', 'polling'],
        upgrade: true,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current.id);
        dispatch(setSocketConnected(true));
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        dispatch(setSocketConnected(false));
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        dispatch(setSocketConnected(false));
      });

      // Set up message listener
      socketRef.current.on("msg-recieve", (msg) => {
        console.log("Received message via socket:", msg);
        console.log("Message type:", typeof msg.message);
        console.log("Message content:", msg.message);

        // Ensure the message format matches what the UI expects
        const formattedMessage = {
          _id: msg._id,
          fromSelf: msg.fromSelf || false,
          message: typeof msg.message === 'string' ? msg.message : (msg.message?.text || 'Invalid message'),
          sender: msg.sender,
          createdAt: msg.createdAt,
          messageType: msg.messageType,
        };

        console.log("Formatted message:", formattedMessage);

        // For messages from self, check if we already have an optimistic version
        // and replace it with the server version
        if (formattedMessage.fromSelf) {
          // This logic is handled by the addMessage reducer which checks for duplicates
        }

        dispatch(addMessage(formattedMessage));
      });
    }
  }, [dispatch]);

  // Disconnect socket
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      console.log("Disconnecting socket");
      socketRef.current.disconnect();
      socketRef.current = null;
      dispatch(setSocketConnected(false));
    }
  }, [dispatch]);

  // Add user to socket
  const addUserToSocket = useCallback((userId) => {
    if (socketRef.current) {
      console.log("Adding user to socket:", userId);
      socketRef.current.emit("add-user", userId);
    }
  }, []);

  // Join a chat room
  const joinChat = useCallback((chatId) => {
    if (socketRef.current) {
      console.log("Joining chat room:", chatId);
      socketRef.current.emit("join-chat", chatId);
    }
  }, []);

  // Leave a chat room
  const leaveChat = useCallback((chatId) => {
    if (socketRef.current) {
      console.log("Leaving chat room:", chatId);
      socketRef.current.emit("leave-chat", chatId);
    }
  }, []);

  // Send message via socket to chat room
  const sendMessage = useCallback((data) => {
    console.log("sendMessage: ", data);
    console.log("socketRef: ", socketRef.current);
    if (socketRef.current) {
      console.log("Sending message via socket:", data);
      socketRef.current.emit("send-msg", data);
    } else {
      console.warn("Socket not connected, cannot send message:", data);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  const value = {
    socket: socketRef.current,
    initializeSocket,
    disconnectSocket,
    addUserToSocket,
    joinChat,
    leaveChat,
    sendMessage,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
