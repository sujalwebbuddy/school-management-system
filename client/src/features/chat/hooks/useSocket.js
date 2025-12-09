import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addMessage, setSocketConnected } from "../../../slices/chatSlice";

export const useSocket = () => {
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
        dispatch(addMessage({ fromSelf: false, message: msg }));
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

  // Send message via socket
  const sendMessage = useCallback((data) => {
    console.log("sendMessage: ", data);
    console.log("socketRef: ", socketRef.current);
    if (socketRef.current) {
      console.log("Sending message via socket:", data);
      socketRef.current.emit("send-msg", data);
    } else {
      console.warn("Socket not connected, cannot send message:", data);
    }
  }, []); // Empty dependency array is fine here since we check socketRef.current at call time

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  return {
    socket: socketRef.current,
    initializeSocket,
    disconnectSocket,
    addUserToSocket,
    sendMessage,
  };
};
