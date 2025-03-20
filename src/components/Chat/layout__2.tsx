
import { useChat } from "@/context/ctx";
import { useState } from "react";

import List from "./list";
import ChatWindow from "./chat";


const CLayout = () => {
  const { activeChat } = useChat();
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex w-full  mx-auto min-h-screen">
      {/* 📌 Lista de Chats */}
      <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 ${showChat ? "hidden md:block" : "block"}`}>
        <List onSelectChat={() => setShowChat(true)} />
      </div>

      {/* 📌 Chat Abierto */}
      <div className={`flex-1 ${!activeChat ? "hidden md:flex" : "block"} ${showChat ? "block" : "hidden md:block"}`}>
        {/* <Chat chatId="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" userId="bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" /> */}
        <ChatWindow onBack={() => setShowChat(false)} />
      </div>
    </div>
  );
};

export default CLayout;
