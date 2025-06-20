const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Chat = require("../models/Chat");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/chat-files/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image, PDF, and document files are allowed"));
    }
  },
});

// Get all chats for a user
router.get("/", auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id,
      isActive: true,
    })
      .populate("participants", "name email avatar")
      .populate("jobId", "title company")
      .sort({ lastMessage: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get or create a chat between two users
router.post("/start", auth, async (req, res) => {
  try {
    const { participantId, jobId } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] },
      isActive: true,
    });

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [req.user.id, participantId],
        jobId: jobId || null,
        messages: [],
      });
      await chat.save();
    }

    // Populate participants
    await chat.populate("participants", "name email avatar");
    if (jobId) {
      await chat.populate("jobId", "title company");
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get messages for a specific chat
router.get("/:chatId/messages", auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("participants", "name email avatar")
      .populate("messages.sender", "name email avatar")
      .populate("messages.readBy.user", "name email avatar");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is participant
    if (!chat.participants.some((p) => p._id.toString() === req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Send a text message
router.post("/:chatId/messages", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const message = {
      sender: req.user.id,
      content,
      messageType: "text",
      readBy: [{ user: req.user.id }],
    };

    chat.messages.push(message);
    chat.lastMessage = new Date();
    await chat.save();

    // Populate sender info
    await chat.populate("messages.sender", "name email avatar");

    const newMessage = chat.messages[chat.messages.length - 1];
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Send a file message
router.post("/:chatId/files", auth, upload.single("file"), async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/chat-files/${req.file.filename}`;
    const message = {
      sender: req.user.id,
      content: req.file.originalname,
      messageType: req.file.mimetype.startsWith("image/") ? "image" : "file",
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      readBy: [{ user: req.user.id }],
    };

    chat.messages.push(message);
    chat.lastMessage = new Date();
    await chat.save();

    // Populate sender info
    await chat.populate("messages.sender", "name email avatar");

    const newMessage = chat.messages[chat.messages.length - 1];
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark messages as read
router.put("/:chatId/read", auth, async (req, res) => {
  try {
    const { messageIds } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Mark specified messages as read
    chat.messages.forEach((message) => {
      if (messageIds.includes(message._id.toString())) {
        const alreadyRead = message.readBy.some(
          (read) => read.user.toString() === req.user.id
        );
        if (!alreadyRead) {
          message.readBy.push({
            user: req.user.id,
            readAt: new Date(),
          });
        }
      }
    });

    await chat.save();
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get unread message count
router.get("/unread/count", auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id,
      isActive: true,
    });

    let totalUnread = 0;
    chats.forEach((chat) => {
      chat.messages.forEach((message) => {
        if (message.sender.toString() !== req.user.id) {
          const isRead = message.readBy.some(
            (read) => read.user.toString() === req.user.id
          );
          if (!isRead) {
            totalUnread++;
          }
        }
      });
    });

    res.json({ unreadCount: totalUnread });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Archive a chat
router.put("/:chatId/archive", auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if user is participant
    if (!chat.participants.includes(req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    chat.isActive = false;
    await chat.save();

    res.json({ message: "Chat archived" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
