import { useChat } from "@/context/context";

const ChatList = ({ onSelectChat }: { onSelectChat: () => void }) => {
  const { chats, activeChat, setActiveChat } = useChat();
  console.log(JSON.stringify(chats))
  return (
    <div className="h-full bg-white overflow-y-auto">
      <h2 className="p-4 text-lg font-bold border-b">Chats</h2>
      {chats?.map((chat) => (
        <div
          key={chat.id}
          className={`p-4 cursor-pointer border-b ${activeChat?.id === chat.id ? "bg-gray-200" : "hover:bg-gray-100"}`}
          onClick={() => {
            setActiveChat(chat);
            onSelectChat();
          }}
        >
          <h3 className="font-semibold">{chat.name}</h3>
          {/*   <p className="text-gray-600 text-sm truncate">
            {chat.messages.length > 0 && chat.messages[chat.messages.length - 1].text}
          </p> */}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
