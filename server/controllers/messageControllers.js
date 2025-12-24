const Messages = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

module.exports.getMessages = async (req, res, next) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({ msg: "chatId and userId are required" });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(chatId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid chatId or userId" });
    }

    const user = await User.findOne({
      _id: userId,
      organizationId: req.organization._id
    });
    if (!user) {
      return res.status(404).json({ msg: "User not found in your organization" });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      organizationId: req.organization._id
    });
    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    if (!chat.isParticipant(userId)) {
      return res.status(403).json({ msg: "User is not a participant in this chat" });
    }

    const messages = await Messages.find({
      chat: chatId,
    })
    .populate('sender', 'firstName lastName username')
    .sort({ createdAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        _id: msg._id,
        fromSelf: msg.sender._id.toString() === userId,
        message: msg.message.text,
        sender: {
          _id: msg.sender._id,
          firstName: msg.sender.firstName,
          lastName: msg.sender.lastName,
          username: msg.sender.username,
        },
        createdAt: msg.createdAt,
        messageType: msg.messageType,
      };
    });

    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

// This method is now mainly for socket-based message creation
// The API endpoint is kept for backward compatibility but messages
// should primarily be created through socket events
module.exports.addMessage = async (req, res, next) => {
  try {
    if (!req.organization) {
      return res.status(403).json({ msg: "Organization context required" });
    }

    const { chatId, senderId, message, messageType = "text" } = req.body;
    
    if (!chatId || !senderId || !message) {
      return res.status(400).json({ msg: "chatId, senderId, and message are required" });
    }
    
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(chatId) || !mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ msg: "Invalid chatId or senderId" });
    }

    const sender = await User.findOne({
      _id: senderId,
      organizationId: req.organization._id
    });
    if (!sender) {
      return res.status(404).json({ msg: "Sender not found in your organization" });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      organizationId: req.organization._id
    });
    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    if (!chat.isParticipant(senderId)) {
      return res.status(403).json({ msg: "User is not a participant in this chat" });
    }
    
    const data = await Messages.create({
      message: { text: message },
      chat: chatId,
      sender: senderId,
      messageType: messageType,
    });

    await Chat.findOneAndUpdate(
      {
        _id: chatId,
        organizationId: req.organization._id
      },
      { lastMessage: data._id }
    );

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
