import { useChat } from "@/context/context";
import { useEffect, useRef } from "react";
const MessageList = () => {
  const { chats, activeChatId } = useChat();
  const chat = chats.find((c) => c.id === activeChatId);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
      {chat?.messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`p-3 max-w-xs rounded-lg shadow ${
              msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
          {/*   <span className="text-xs opacity-70 block text-right">{formatDate(msg.timestamp)}</span> */}
          </div>
        </div>
      ))}
      <div ref={chatEndRef}></div>
    </div>
  );
};

export default MessageList;
