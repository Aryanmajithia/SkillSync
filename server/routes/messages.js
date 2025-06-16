const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Chat = require("../models/Chat");
const User = require("../models/User");

// Get all chats for a user
router.get("/", auth, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "fullName email avatar")
      .populate("lastMessage.sender", "fullName")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
});

// Get a specific chat
router.get("/:chatId", auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      participants: req.user.id,
    })
      .populate("participants", "fullName email avatar")
      .populate("messages.sender", "fullName avatar");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ message: "Failed to fetch chat" });
  }
});

// Create a new chat or get existing chat
router.post("/", auth, async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] },
      type: "direct",
    }).populate("participants", "fullName email avatar");

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [req.user.id, participantId],
        type: "direct",
        messages: [],
      });
      await chat.save();
      chat = await chat.populate("participants", "fullName email avatar");
    }

    res.json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: "Failed to create chat" });
  }
});

// Send a message
router.post("/:chatId/messages", auth, async (req, res) => {
  try {
    const { content, type = "text" } = req.body;
    const chatId = req.params.chatId;

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = {
      sender: req.user.id,
      content,
      type,
      timestamp: new Date(),
      read: false,
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    chat.updatedAt = new Date();

    await chat.save();

    const populatedChat = await Chat.findById(chatId)
      .populate("participants", "fullName email avatar")
      .populate("messages.sender", "fullName avatar");

    res.json(populatedChat);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Mark messages as read
router.put("/:chatId/read", auth, async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.chatId,
        participants: req.user.id,
        "messages.sender": { $ne: req.user.id },
      },
      {
        $set: {
          "messages.$[].read": true,
        },
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
});

// Get unread message count
router.get("/unread/count", auth, async (req, res) => {
  try {
    const count = await Chat.aggregate([
      {
        $match: {
          participants: req.user.id,
          "messages.sender": { $ne: req.user.id },
          "messages.read": false,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $match: {
          "messages.sender": { $ne: req.user.id },
          "messages.read": false,
        },
      },
      {
        $count: "count",
      },
    ]);

    res.json({ count: count[0]?.count || 0 });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
});

// Delete a chat
router.delete("/:chatId", auth, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.chatId,
      participants: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: "Failed to delete chat" });
  }
});

module.exports = router;
