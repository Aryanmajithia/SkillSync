import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await axios.get("/api/messages/conversations");
      return response.data;
    },
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", selectedConversation?._id],
    queryFn: async () => {
      if (!selectedConversation) return [];
      const response = await axios.get(
        `/api/messages/${selectedConversation._id}`
      );
      return response.data;
    },
    enabled: !!selectedConversation,
  });

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await axios.post(`/api/messages/${selectedConversation._id}`, {
        content: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {conversations?.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedConversation?._id === conversation._id
                  ? "bg-blue-50"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {conversation.participants
                    .find((p) => p._id !== user?._id)
                    ?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">
                    {
                      conversation.participants.find((p) => p._id !== user?._id)
                        ?.name
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
            <div className="p-4 border-b">
              <h3 className="font-medium">
                {
                  selectedConversation.participants.find(
                    (p) => p._id !== user?._id
                  )?.name
                }
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                messages?.map((message) => (
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
                          : "bg-gray-100"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-4 border-t">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
