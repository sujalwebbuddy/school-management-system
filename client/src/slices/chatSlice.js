import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Async thunks for chat operations
export const getUserChats = createAsyncThunk(
  "chat/getUserChats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/chats");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createChat = createAsyncThunk(
  "chat/createChat",
  async ({ name, participantIds, type = "direct" }, { rejectWithValue }) => {
    try {
      const res = await api.post("/chats", { name, participantIds, type });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async ({ chatId, userId }, { rejectWithValue }) => {
    try {
      const res = await api.post("/messages/getmsg", { chatId, userId });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// This is now primarily used for socket-based messaging
// Keeping for backward compatibility
export const sendMessageAPI = createAsyncThunk(
  "chat/sendMessageAPI",
  async ({ chatId, senderId, message }, { rejectWithValue }) => {
    try {
      const res = await api.post("/messages/addmsg", { chatId, senderId, message });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    currentChat: null,
    messages: [],
    isConnected: false,
    loading: false,
    error: null,
  },
  reducers: {
    setSocketConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      const newMessage = action.payload;

      // For messages from self (received via socket), check if we have an optimistic version
      if (newMessage.fromSelf) {
        // Look for an optimistic message with the same content and sender
        const optimisticIndex = state.messages.findIndex(msg =>
          msg.fromSelf &&
          msg.message === newMessage.message &&
          msg.sender._id === newMessage.sender._id &&
          msg._id.startsWith('temp-') // Optimistic messages have temp IDs
        );

        if (optimisticIndex !== -1) {
          // Replace the optimistic message with the real one
          state.messages[optimisticIndex] = newMessage;
          return;
        }
      }

      // Check for exact duplicate by ID
      const exists = state.messages.find(msg => msg._id === newMessage._id);
      if (!exists) {
        state.messages.push(newMessage);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addChat: (state, action) => {
      const exists = state.chats.find(chat => chat._id === action.payload._id);
      if (!exists) {
        state.chats.unshift(action.payload); // Add to beginning
      }
    },
    updateChatLastMessage: (state, action) => {
      const chat = state.chats.find(c => c._id === action.payload.chatId);
      if (chat) {
        chat.lastMessage = action.payload.message;
        chat.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user chats
      .addCase(getUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.chats || [];
        state.error = null;
      })
      .addCase(getUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create chat
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new chat to the list
        state.chats.unshift(action.payload.chat);
        state.error = null;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get messages
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send message API (fallback)
      .addCase(sendMessageAPI.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessageAPI.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(sendMessageAPI.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default chatSlice.reducer;
export const {
  setSocketConnected,
  setCurrentChat,
  addMessage,
  clearMessages,
  addChat,
  updateChatLastMessage,
} = chatSlice.actions;
