import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Mock conversations data since the API doesn't exist yet
  const mockConversations = [
    {
      _id: "1",
      participants: [
        { _id: user?._id, name: user?.name || "You" },
        { _id: "2", name: "John Doe" },
      ],
      lastMessage: { content: "Thanks for your application!" },
    },
    {
      _id: "2",
      participants: [
        { _id: user?._id, name: user?.name || "You" },
        { _id: "3", name: "Jane Smith" },
      ],
      lastMessage: { content: "When can you start?" },
    },
  ];

  const mockMessages = selectedConversation
    ? [
        {
          _id: "1",
          content: "Hi, I'm interested in the position",
          sender: { _id: user?._id, name: user?.name || "You" },
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
        },
        {
          _id: "2",
          content: "Thanks for your application!",
          sender: {
            _id: selectedConversation.participants.find(
              (p) => p._id !== user?._id
            )?._id,
            name: selectedConversation.participants.find(
              (p) => p._id !== user?._id
            )?.name,
          },
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        },
      ]
    : [];

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    // Mock sending message
    console.log("Sending message:", newMessage);
    setNewMessage("");
    // In a real app, you would call the API here
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            Communicate with employers and candidates
          </p>
        </div>

        <div className="h-[calc(100vh-12rem)] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {mockConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?._id === conversation._id
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {conversation.participants
                        .find((p) => p._id !== user?._id)
                        ?.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {
                          conversation.participants.find(
                            (p) => p._id !== user?._id
                          )?.name
                        }
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-medium text-gray-900">
                    {
                      selectedConversation.participants.find(
                        (p) => p._id !== user?._id
                      )?.name
                    }
                  </h3>
                  <p className="text-sm text-gray-500">Active now</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {mockMessages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.sender._id === user?._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender._id === user?._id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender._id === user?._id
                              ? "opacity-70"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t">
                  <div className="flex space-x-4">
                    <Input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      Send
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
