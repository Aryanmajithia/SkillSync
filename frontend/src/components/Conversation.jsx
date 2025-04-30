import { useAuth } from "@/hooks/useAuth";

export default function Conversation({ conversation, isSelected, onClick }) {
  const { user } = useAuth();
  const otherParticipant = conversation.participants.find(
    (p) => p._id !== user?._id
  );

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
        isSelected ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {otherParticipant?.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium truncate">{otherParticipant?.name}</h3>
            {conversation.lastMessage && (
              <span className="text-xs text-gray-500">
                {new Date(
                  conversation.lastMessage.timestamp
                ).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">
            {conversation.lastMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>
    </div>
  );
}
