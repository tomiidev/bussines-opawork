import { useChat } from "@/context/context";

const ChatSidebar = () => {
  const { chats, activeChat, setActiveChat } = useChat();

  return (
    <div className="w-1/4 bg-white border-r shadow-lg p-4">
      <h2 className="text-lg font-bold mb-4">Chats</h2>
      <div className="space-y-2">
        {chats?.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat)}
            className={`p-3 rounded-lg cursor-pointer transition ${activeChat === chat ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
          >
            <p className="font-semibold">{chat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
