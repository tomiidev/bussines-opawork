
import { useChat } from "@/context/context";
import { useState } from "react";
import ChatWindow from "./window";
import ChatList from "./chatList";

const ChatLayout = () => {
  const { activeChat } = useChat();
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex max-w-7xl  mx-auto min-h-screen">
      {/* 📌 Lista de Chats */}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 ${showChat ? "hidden md:block" : "block"}`}>
        <ChatList onSelectChat={() => setShowChat(true)} />
      </div>

      {/* 📌 Chat Abierto */}
      <div className={`flex-1 ${!activeChat ? "hidden md:flex" : "block"} ${showChat ? "block" : "hidden md:block"}`}>
        <ChatWindow onBack={() => setShowChat(false)} />
      </div>
    </div>
  );
};

export default ChatLayout;
