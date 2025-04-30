import { useAuth } from "@/hooks/useAuth";

export default function Message({ message }) {
  const { user } = useAuth();
  const isOwnMessage = message.sender._id === user?._id;

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage ? "bg-blue-600 text-white" : "bg-gray-100"
        }`}
      >
        {!isOwnMessage && (
          <p className="text-xs font-medium text-gray-500 mb-1">
            {message.sender.name}
          </p>
        )}
        <p>{message.content}</p>
        <p className="text-xs mt-1 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
