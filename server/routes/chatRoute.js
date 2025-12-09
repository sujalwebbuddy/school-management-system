const { createChat, getUserChats, getChatById, addParticipant, removeParticipant } = require("../controllers/chatControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

// All chat routes require authentication
router.use(authMiddleware);

// Create a new chat
router.post("/", createChat);

// Get all chats for the authenticated user
router.get("/", getUserChats);

// Get specific chat by ID
router.get("/:chatId", getChatById);

// Add participant to chat
router.post("/:chatId/participants", addParticipant);

// Remove participant from chat
router.delete("/:chatId/participants/:userId", removeParticipant);

module.exports = router;
