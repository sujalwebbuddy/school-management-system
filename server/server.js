const express = require("express");
const app = express();
const cors = require("cors");
const socket = require("socket.io");
const config = require("./config/envConfig");
const Messages = require("./models/messageModel");
const Chat = require("./models/chatModel");
const mongoose = require("mongoose");

// database configuration

const connectDB = require("./config/connectDB");
connectDB();

// Stripe webhook route (must be before express.json() middleware)
// Stripe requires raw body for signature verification
app.post(
  '/api/v1/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  require('./controllers/stripeWebhookController').handleStripeWebhook
);

// general middlewares
app.use(express.json());
app.use(cors());

// login/register route
app.use("/api/v1/users", require("./routes/login_regRoute"));
app.use("/api/v1/admin", require("./routes/adminRoute"));
app.use("/api/v1/teacher", require("./routes/teacherRoute"));
app.use("/api/v1/student", require("./routes/studentRoute"));
app.use("/api/v1/messages", require("./routes/messageRoute"));
app.use("/api/v1/authmsg", require("./routes/messageAuth"));
app.use("/api/v1/chats", require("./routes/chatRoute"));
app.use("/api/v1/tasks", require("./routes/taskRoute"));
app.use("/api/v1/organizations", require("./routes/organizationRoute"));

app.use("/uploads", express.static("./uploads"));

const server = app.listen(config.PORT, () => {
  console.info(`server running on port : ${config.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: Array.isArray(config.CORS_ORIGIN) ? config.CORS_ORIGIN : [config.CORS_ORIGIN],
    credentials: true,
  },
});

// Track online users and their socket connections
global.onlineUsers = new Map(); // userId -> socketId
global.userSockets = new Map(); // socketId -> userId

io.on("connection", (socket) => {

  // User authentication and online status
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    userSockets.set(socket.id, userId);
  });

  // Join a chat room
  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
  });

  // Leave a chat room
  socket.on("leave-chat", (chatId) => {
    socket.leave(chatId);
  });

  // Send message to chat room
  socket.on("send-msg", async (data) => {
    try {
      const { chatId, senderId, message } = data;

      // Validate required fields
      if (!chatId || !senderId || !message) {
        socket.emit("error", { message: "Missing required fields" });
        return;
      }

      // Validate ObjectIds
      if (!mongoose.Types.ObjectId.isValid(chatId) || !mongoose.Types.ObjectId.isValid(senderId)) {
        socket.emit("error", { message: "Invalid chatId or senderId" });
        return;
      }

      // Check if chat exists and user is participant
      const chat = await Chat.findById(chatId);
      if (!chat) {
        socket.emit("error", { message: "Chat not found" });
        return;
      }

      if (!chat.isParticipant(senderId)) {
        socket.emit("error", { message: "User is not a participant in this chat" });
        return;
      }

      // Create and save message
      const newMessage = await Messages.create({
        message: { text: message },
        chat: chatId,
        sender: senderId,
        messageType: "text",
      });

      // Update chat's last message
      await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });

      // Populate sender info
      await newMessage.populate('sender', 'firstName lastName username');

      // Prepare message for broadcasting
      const messageData = {
        _id: newMessage._id,
        fromSelf: false, // This will be determined on the client side
        message: newMessage.message.text, // Ensure this is a string
        chat: newMessage.chat,
        sender: {
          _id: newMessage.sender._id,
          firstName: newMessage.sender.firstName,
          lastName: newMessage.sender.lastName,
          username: newMessage.sender.username,
        },
        createdAt: newMessage.createdAt,
        messageType: newMessage.messageType,
      };

      // Broadcast to all participants in the chat room
      io.to(chatId).emit("msg-recieve", messageData);

    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const userId = userSockets.get(socket.id);
    if (userId) {
      onlineUsers.delete(userId);
      userSockets.delete(socket.id);
    }
  });
});
