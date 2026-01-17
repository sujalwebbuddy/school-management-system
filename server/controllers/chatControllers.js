const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

module.exports.createChat = async (req, res, next) => {
  try {
    const { name, description, type = "direct", participantIds } = req.body;
    const createdBy = req.userId;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({ msg: "At least one participant is required" });
    }

    // For direct chats, ensure only 2 participants
    if (type === "direct" && participantIds.length !== 1) {
      return res.status(400).json({ msg: "Direct chats must have exactly 1 other participant" });
    }

    // Add creator to participants
    const allParticipants = [...participantIds, createdBy];

    // Validate all participant IDs and ensure they belong to the same organization
    for (const participantId of allParticipants) {
      if (!mongoose.Types.ObjectId.isValid(participantId)) {
        return res.status(400).json({ msg: `Invalid participant ID: ${participantId}` });
      }

      // Check if user exists and belongs to the organization
      const user = await User.findOne({
        _id: participantId,
        organizationId: req.organization._id
      });
      if (!user) {
        return res.status(404).json({ msg: `User not found in your organization: ${participantId}` });
      }
    }

    // For direct chats, check if chat already exists between these users in the organization
    if (type === "direct") {
      const existingChat = await Chat.findOne({
        type: "direct",
        organizationId: req.organization._id,
        participants: {
          $all: allParticipants,
          $size: allParticipants.length
        }
      });

      if (existingChat) {
        return res.status(200).json({
          msg: "Direct chat already exists",
          chat: existingChat
        });
      }
    }

    // Create chat name for direct chats
    let chatName = name;
    if (type === "direct" && !name) {
      const participants = await User.find({ _id: { $in: participantIds } });
      const participantNames = participants.map(p => `${p.firstName} ${p.lastName}`);
      chatName = participantNames.join(", ");
    }

    const chat = await Chat.create({
      name: chatName || "New Chat",
      description: description || "",
      type,
      participants: allParticipants.map(userId => ({
        user: userId,
        role: userId.toString() === createdBy.toString() ? "admin" : "member"
      })),
      createdBy,
      organizationId: req.organization._id,
    });

    await chat.populate('participants.user', 'firstName lastName username role');
    await chat.populate('createdBy', 'firstName lastName username');

    res.status(201).json({
      msg: "Chat created successfully",
      chat
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUserChats = async (req, res, next) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const userId = req.userId; // Assuming auth middleware sets req.user

    const chats = await Chat.find({
      participants: {
        $elemMatch: { user: userId }
      },
      organizationId: req.organization._id,
      isActive: true
    })
    .populate([
      { path: 'participants.user', select: 'firstName lastName username role avatarImage' },
      'lastMessage',
      { path: 'createdBy', select: 'firstName lastName username' }
    ])
    .sort({ updatedAt: -1 });

    res.json({
      msg: "Chats retrieved successfully",
      chats
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getChatById = async (req, res, next) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const { chatId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ msg: "Invalid chat ID" });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      organizationId: req.organization._id
    })
      .populate([
        { path: 'participants.user', select: 'firstName lastName username role avatarImage' },
        'lastMessage',
        { path: 'createdBy', select: 'firstName lastName username' }
      ]);

    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    if (!chat.isParticipant(userId)) {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.json({
      msg: "Chat retrieved successfully",
      chat
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.addParticipant = async (req, res, next) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const { chatId } = req.params;
    const { userId, role = "member" } = req.body;
    const requesterId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(chatId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid chat ID or user ID" });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      organizationId: req.organization._id
    });
    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    // Check if requester is admin of the chat
    const requesterParticipant = chat.participants.find(p => p.user.toString() === requesterId.toString());
    if (!requesterParticipant || requesterParticipant.role !== "admin") {
      return res.status(403).json({ msg: "Only chat admins can add participants" });
    }

    // Check if user exists and belongs to the organization
    const user = await User.findOne({
      _id: userId,
      organizationId: req.organization._id
    });
    if (!user) {
      return res.status(404).json({ msg: "User not found in your organization" });
    }

    // Add participant
    const added = chat.addParticipant(userId, role);
    if (!added) {
      return res.status(400).json({ msg: "User is already a participant" });
    }

    await chat.save();
    await chat.populate('participants.user', 'firstName lastName username role avatarImage');

    res.json({
      msg: "Participant added successfully",
      chat
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.removeParticipant = async (req, res, next) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const { chatId, userId } = req.params;
    const requesterId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(chatId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid chat ID or user ID" });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      organizationId: req.organization._id
    });
    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    // Verify the user being removed belongs to the organization
    const user = await User.findOne({
      _id: userId,
      organizationId: req.organization._id
    });
    if (!user) {
      return res.status(404).json({ msg: "User not found in your organization" });
    }

    // Check if requester is admin or removing themselves
    const requesterParticipant = chat.participants.find(p => p.user.toString() === requesterId.toString());
    if (requesterId.toString() !== userId.toString() &&
        (!requesterParticipant || requesterParticipant.role !== "admin")) {
      return res.status(403).json({ msg: "Only chat admins can remove other participants" });
    }

    // Remove participant
    const removed = chat.removeParticipant(userId);
    if (!removed) {
      return res.status(400).json({ msg: "User is not a participant" });
    }

    await chat.save();

    // If no participants left, deactivate chat
    if (chat.participants.length === 0) {
      chat.isActive = false;
      await chat.save();
    }

    res.json({
      msg: "Participant removed successfully"
    });
  } catch (ex) {
    next(ex);
  }
};
