const { createChat, getUserChats, getChatById, addParticipant, removeParticipant } = require("../controllers/chatControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const tenantMiddleware = require("../middlewares/tenantMiddleware");
const { requireFeature } = require("../middlewares/featureGatingMiddleware");

const router = require("express").Router();

// All chat routes require authentication, organization context, and chat feature
router.use(authMiddleware);
router.use(tenantMiddleware);
router.use(requireFeature("chat"));

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
