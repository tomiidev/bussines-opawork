import { API_LOCAL } from "@/hooks/apis";
import axios from "axios";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
interface User {
  id: string;
  email: string;
  name: string;
  typeAccount: string

}


interface Message {
  id: string;
  text: string;
  senderId: string;
  senderType: "u" | "b";
  receiverId: string;
  receiverType: "u" | "b";
  timestamp: number;
}

interface Chat {
  id: string;
  name: string;
  participants: string[]; // IDs de los usuarios en el chat
  messages: Message[];
  chats: string[]
}

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  user: User | null; // Permitir que sea null
  setUser: (user: User) => void
  setActiveChat: (chat: Chat | null) => void;
  handleSend: (chatId: string, text: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {


    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_LOCAL}/check-auth`, { withCredentials: true });

        if (response.status === 200) {
          console.log(response)
          const userData = response.data.user;
          setUser(userData);
        } else {
          setUser(null);

        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setUser(null);

      }
    }
    checkAuth();

  }, [])

  // 🔹 Obtener los chats del usuario autenticado al cargar
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`${API_LOCAL}/chats`, {
          method: "GET",
          mode: "cors",
          credentials: "include"
        });

        const data = await response.json();
        setChats(data.data || []); // Si no hay chats, inicializar con un array vacío
      } catch (error) {
        console.error("Error obteniendo los chats:", error);
      }
    };

    fetchChats();
  }, []); // Se ejecuta solo una vez al montar el componente

  // 📨 Función para enviar mensajes
  const handleSend = async (chatId: string, text: string) => {
    console.log(chatId,text)
    if (!user) {
      console.error("No hay sesión activa");
      return;
    }

    const { id: senderId, typeAccount: senderType } = user; // Usuario autenticado
    console.log(user) 
    // Obtener destinatario basado en los participantes
    const chat = chats.find((c) => c.id === chatId);
    console.log("el chat" + JSON.stringify(chats))
    if (!chat) return;

    const receiverId = chat.participants.find((id) => id !== senderId) || ""; 
      const receiverType = receiverId.startsWith("b") ? "b" : "u"; // Suponiendo que los IDs de negocio tienen prefijo */
    // Agregar mensaje localmente antes de enviarlo
     setChats((prevChats) =>
      (prevChats ?? []).map((c) =>
        c.id === chatId
          ? {
            ...c,
            messages: [
              ...(c.messages ?? []), // Aseguramos que messages sea un array válido
              {
                id: Date.now().toString(),
                text: text,
                chatId: chatId,
                senderId: receiverId,
                senderType: senderId,
                receiverId: receiverId,
                receiverType: senderType,
                timestamp: Date.now(),
              } as Message, // Forzamos a TypeScript a reconocer la estructura correcta
            ],
          } as Chat // Aseguramos que el objeto resultante respete la interfaz Chat
          : c
      )
    );


    try {
      // Enviar el mensaje al servidor
      const response = await fetch(`${API_LOCAL}/sendmessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chats: chats }),
        mode: "cors",
        credentials: "include"
      });

      const data = await response.json();

      if (data.response) {
        // Agregar respuesta del servidor al chat (ej. si hay respuesta automática)
        setChats((prevChats) =>
          (prevChats ?? []).map((c) =>
            c.id === chatId
              ? {
                ...c,
                messages: [
                  ...(c.messages ?? []), // Aseguramos que messages sea un array válido
                  {
                    id: Date.now().toString(),
                    text: data.response,
                    senderId: receiverId,
                    senderType: senderType,
                    receiverId: receiverId,
                    receiverType: senderType,
                    timestamp: Date.now(),
                  } as Message, // Forzamos a TypeScript a reconocer la estructura correcta
                ],
              } as Chat // Aseguramos que el objeto resultante respete la interfaz Chat
              : c
          )
        );

      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    } 
  };

  return (
    <ChatContext.Provider value={{ chats, activeChat, setActiveChat, handleSend, user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat debe usarse dentro de ChatProvider");
  return context;
};
