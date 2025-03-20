import { useChat } from "@/context/context";
import { API_LOCAL, API_URL } from "@/hooks/apis";
import { useEffect, useState } from "react";

const ChatWindow = ({ onBack }: { onBack: () => void }) => {
  const { chats, activeChat, user, handleSend } = useChat();
  const chat = chats.find((c) => c.id === activeChat?.id); // Chat activo
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]); // Estado para los mensajes
  console.log(JSON.stringify(messages))
  // Cargar los mensajes del servidor cuando se selecciona un chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      try {
        const response = await fetch(`${API_URL}/messages/${activeChat.chats[0]}`, {
          method: "GET",
          mode: "cors",
          credentials: "include"
        });
        const data = await response.json();
        setMessages(data.data || []); // Si no hay mensajes, inicializar con un array vacío
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [activeChat]); // Re-fetch messages cuando activeChatId cambia

  if (!chat) return <div className="flex items-center justify-center h-full">Selecciona un chat</div>;

  /* const handleSendMessage = async () => { */
  const handleSennd = async () => {
    if (!activeChat || !message.trim()) return;

    try {
      const newMessage = handleSend(activeChat.id, message); // Espera la respuesta del servidor
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Solo actualiza si hay respuesta
      setMessage("");
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  return (
    <div className="flex-1 flex-col h-screen">
      {/* Header del Chat */}
      <div className="p-4 flex items-center border-b bg-white">
        <button className="md:hidden mr-4" onClick={onBack}>🔙</button>
        <h2 className="font-bold">{chat.name}</h2>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.length > 0 ? messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <div
              className={`p-2 rounded-lg max-w-xs ${msg.sender._id === user?.id
                ? "bg-blue-500 text-white self-end ml-auto" // Alineado a la derecha para el usuario
                : "bg-gray-300 self-start mr-auto" // Alineado a la izquierda para el bot
                }`}
            >
              {msg.text}
            </div>

            {/* Nombre del usuario o bot */}
            <div className={`text-xs ${msg.sender._id === user?.id ? "self-end mr-2" : "self-start ml-2"}`}>
              {msg.sender._id === user?.id ? "Tú" : msg.sender.email} {/* Aquí puedes poner el nombre del usuario si tienes */}
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500">No hay mensajes en este chat.</div>
        )}
      </div>


      {/* Input de Mensaje */}
      <div className="p-4 border-t bg-white flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSennd()}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleSennd}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
