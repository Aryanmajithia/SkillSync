import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSend(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex space-x-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
  );
}
