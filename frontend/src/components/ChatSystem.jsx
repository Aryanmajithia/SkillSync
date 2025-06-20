import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Paperclip, Send, Image, File, Check, CheckCheck } from "lucide-react";
import axios from "../lib/axios";

const ChatSystem = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fileUpload, setFileUpload] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io(
        import.meta.env.VITE_API_URL || "http://localhost:5000"
      );
      setSocket(newSocket);

      // Join with user ID
      newSocket.emit("join", user.id);

      // Socket event listeners
      newSocket.on("receive_message", handleReceiveMessage);
      newSocket.on("user_typing", handleUserTyping);
      newSocket.on("user_stopped_typing", handleUserStoppedTyping);
      newSocket.on("message_read", handleMessageRead);
      newSocket.on("message_sent", handleMessageSent);

      // Load chats and unread count
      loadChats();
      loadUnreadCount();

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat._id);
      markMessagesAsRead();
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = async () => {
    try {
      const response = await axios.get("/api/chat");
      setChats(response.data);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const response = await axios.get(`/api/chat/${chatId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await axios.get("/api/chat/unread/count");
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const handleReceiveMessage = (data) => {
    if (selectedChat && data.chatId === selectedChat._id) {
      setMessages((prev) => [...prev, data.message]);
      markMessagesAsRead();
    }
    loadUnreadCount();
  };

  const handleUserTyping = (data) => {
    if (selectedChat && data.chatId === selectedChat._id) {
      setTypingUsers((prev) => new Set(prev).add(data.userId));
    }
  };

  const handleUserStoppedTyping = (data) => {
    if (selectedChat && data.chatId === selectedChat._id) {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    }
  };

  const handleMessageRead = (data) => {
    if (selectedChat && data.chatId === selectedChat._id) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? { ...msg, readBy: [...msg.readBy, { user: data.readBy }] }
            : msg
        )
      );
    }
  };

  const handleMessageSent = (data) => {
    // Message sent successfully
    console.log("Message sent:", data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !fileUpload) return;

    try {
      if (fileUpload) {
        // Send file
        const formData = new FormData();
        formData.append("file", fileUpload);

        const response = await axios.post(
          `/api/chat/${selectedChat._id}/files`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setMessages((prev) => [...prev, response.data]);
        setFileUpload(null);
      } else {
        // Send text message
        const response = await axios.post(
          `/api/chat/${selectedChat._id}/messages`,
          {
            content: newMessage,
          }
        );

        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
      }

      // Emit socket event
      const otherParticipant = selectedChat.participants.find(
        (p) => p._id !== user.id
      );
      socket.emit("send_message", {
        chatId: selectedChat._id,
        message: response.data,
        recipientId: otherParticipant._id,
      });

      // Stop typing indicator
      socket.emit("typing_stop", {
        chatId: selectedChat._id,
        recipientId: otherParticipant._id,
      });
      setIsTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      const otherParticipant = selectedChat.participants.find(
        (p) => p._id !== user.id
      );
      socket.emit("typing_start", {
        chatId: selectedChat._id,
        recipientId: otherParticipant._id,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      const otherParticipant = selectedChat.participants.find(
        (p) => p._id !== user.id
      );
      socket.emit("typing_stop", {
        chatId: selectedChat._id,
        recipientId: otherParticipant._id,
      });
    }, 1000);
  };

  const markMessagesAsRead = async () => {
    if (!selectedChat) return;

    const unreadMessages = messages.filter(
      (msg) =>
        msg.sender._id !== user.id &&
        !msg.readBy.some((read) => read.user._id === user.id)
    );

    if (unreadMessages.length > 0) {
      try {
        await axios.put(`/api/chat/${selectedChat._id}/read`, {
          messageIds: unreadMessages.map((msg) => msg._id),
        });

        // Emit read receipt
        const otherParticipant = selectedChat.participants.find(
          (p) => p._id !== user.id
        );
        unreadMessages.forEach((msg) => {
          socket.emit("mark_read", {
            chatId: selectedChat._id,
            messageId: msg._id,
            recipientId: otherParticipant._id,
          });
        });

        loadUnreadCount();
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
    }
  };

  const startNewChat = async (participantId, jobId = null) => {
    try {
      const response = await axios.post("/api/chat/start", {
        participantId,
        jobId,
      });

      setChats((prev) => {
        const existing = prev.find((chat) => chat._id === response.data._id);
        return existing ? prev : [response.data, ...prev];
      });

      setSelectedChat(response.data);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find((p) => p._id !== user.id);
  };

  const getLastMessage = (chat) => {
    if (chat.messages.length === 0) return "No messages yet";
    const lastMsg = chat.messages[chat.messages.length - 1];
    if (lastMsg.messageType === "file") {
      return `📎 ${lastMsg.fileName}`;
    }
    return lastMsg.content.length > 50
      ? lastMsg.content.substring(0, 50) + "..."
      : lastMsg.content;
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Messages</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>

        <div className="overflow-y-auto h-[calc(100%-80px)]">
          {chats.map((chat) => {
            const otherUser = getOtherParticipant(chat);
            const unreadInChat = chat.messages.filter(
              (msg) =>
                msg.sender._id !== user.id &&
                !msg.readBy.some((read) => read.user._id === user.id)
            ).length;

            return (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedChat?._id === chat._id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={otherUser.avatar} />
                    <AvatarFallback>
                      {otherUser.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {otherUser.name}
                      </h3>
                      {unreadInChat > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {unreadInChat}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 truncate">
                      {getLastMessage(chat)}
                    </p>

                    {chat.jobId && (
                      <p className="text-xs text-blue-600 truncate">
                        Re: {chat.jobId.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={getOtherParticipant(selectedChat).avatar} />
                  <AvatarFallback>
                    {getOtherParticipant(selectedChat)
                      .name?.charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-medium">
                    {getOtherParticipant(selectedChat).name}
                  </h3>
                  {selectedChat.jobId && (
                    <p className="text-sm text-gray-500">
                      Re: {selectedChat.jobId.title}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender._id === user.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      message.sender._id === user.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    } rounded-lg px-4 py-2`}
                  >
                    {message.messageType === "file" ? (
                      <div className="flex items-center space-x-2">
                        <File className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{message.fileName}</p>
                          <p className="text-xs opacity-75">
                            {formatFileSize(message.fileSize)}
                          </p>
                          <a
                            href={`${import.meta.env.VITE_API_URL}${
                              message.fileUrl
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-200 underline"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ) : message.messageType === "image" ? (
                      <div>
                        <img
                          src={`${import.meta.env.VITE_API_URL}${
                            message.fileUrl
                          }`}
                          alt="Shared image"
                          className="max-w-full rounded"
                        />
                        <p className="text-xs mt-1">{message.fileName}</p>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}

                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <span className="text-xs opacity-75">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {message.sender._id === user.id && (
                        <div className="flex items-center">
                          {message.readBy.some(
                            (read) => read.user._id !== user.id
                          ) ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {typingUsers.size > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-500 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              {fileUpload && (
                <div className="mb-2 p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      📎 {fileUpload.name} ({formatFileSize(fileUpload.size)})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFileUpload(null)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Paperclip className="w-4 h-4" />
                    </span>
                  </Button>
                </label>

                <Textarea
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 resize-none"
                  rows={1}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />

                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() && !fileUpload}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                Select a conversation
              </h3>
              <p className="text-sm">
                Choose a chat from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
