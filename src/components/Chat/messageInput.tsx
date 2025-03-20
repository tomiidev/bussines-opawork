import { useChat } from "@/context/context";
import { useState } from "react";
import { BsSend } from "react-icons/bs";


const MessageInput = () => {
  const [text, setText] = useState("");
  const { activeChat, handleSend } = useChat();

  const handleSendd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ✅ Corrección de `preventDefault`

    if (!text.trim() || !activeChat) return; // ✅ Validación combinada
    console.log(activeChat)
     handleSend(activeChat.id, text); // ✅ Pasar `activeChat.id` en lugar de `activeChat`

    setText(""); // ✅ Limpiar el campo de texto
  };

  return (
    <form onSubmit={handleSendd} className="p-4 border-t bg-white flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Escribe un mensaje..."
      />
      <button
        type="submit" // ✅ Cambiado a `submit` para evitar problemas de eventos
        className="bg-blue-500 text-white p-2 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
      >
        <BsSend size={20} />
      </button>
    </form>
  );
};

export default MessageInput;
