import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import axios from "../lib/axios";

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hi! I'm Gemini AI. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post("/api/ai/chatbot", {
        message: input,
        history: messages,
      });
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: res.data.reply || "(No response)" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "bot" && (
              <Avatar className="mr-2 w-8 h-8">
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <form onSubmit={sendMessage} className="flex gap-2 p-2 border-t">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          {loading ? "..." : "Send"}
        </Button>
      </form>
    </Card>
  );
};

export default AIAssistant;
