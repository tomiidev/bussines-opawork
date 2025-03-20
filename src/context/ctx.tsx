import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { supabase } from "@/supabase"; // Asegúrate de que supabase esté configurado correctamente
import axios from "axios";
import { API_LOCAL } from "@/hooks/apis";

interface User {
  _id: string;
  email: string;
  name: string;
  typeAccount: string;
  name_one: string;
  name_two: string
  user1: string,
  user2: string
  sender_mongo_id: string
}

/* interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
} */
interface Message {
  id: string;
  sender_mongo_id: string;
  receiverid: string;
  text: string;
  created_at: string;
}
interface Chat {
  id: string;
  user1: string;
  user2: string;
  name_one: string;
  name_two: string;
  created_at: Date;
  messages: Message[]; // Almacenamos los mensajes relacionados con este chat
}

interface ChatContextType {
  chats: Chat[];
  chat: Chat | null;
  activeChat: Chat | null;
  titleAdvise: string | null;
  user: User | null;
  receiver: User | undefined;
  receivers: User[];
  messages: Message[] | null;
  setUser: (user: User) => void;
  setActiveChat: (chat: Chat | null) => void;
  setChats: (chats: Chat[]) => void;
  setReceivers: (users: User[]) => void; // 🔹 Corregido: ahora recibe un array de User[]
  setChat: (chat: Chat | null) => void;  // 🔹 Corregido: ahora recibe un Chat o null
  setMessages: (messages: Message[]) => void;

}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProviderSupabase = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [receiver, setReceiver] = useState<User>();
  const [receivers, setReceivers] = useState<User[]>([]); // 🔹 Corregido: ya no se necesita `[]` explícito
  const [messages, setMessages] = useState<Message[]>([]);
  const [titleAdvise, setTitleAdvise] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  ; // Asegúrate de reemplazarlo con el userId real del usuario autenticado
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

  // Efecto para cargar chats desde Supabase

  useEffect(() => {
    async function fetchChats() {
      if (!user || !user.sender_mongo_id) return; // Si no hay usuario autenticado o no tiene sender_mongo_id, salir

      // Obtener chats donde el usuario autenticado es user1 o user2
      const { data: chatsData, error } = await supabase
        .from("chats")
        .select("*")
        .or(`user1.eq.${user.sender_mongo_id},user2.eq.${user.sender_mongo_id}`)
        .order("created_at", { ascending: false }); // Ordenar por fecha de creación

      if (error) {
        console.error("Error al cargar chats:", error);
        return;
      }

      console.log("Chats obtenidos:", chatsData);

      // Cargar los mensajes asociados a cada chat
      const chatsWithMessages = await Promise.all(
        chatsData?.map(async (chat) => {
          const { data: messagesData, error } = await supabase
            .from("messages")
            .select("*")
            .eq("chat_id", chat.id)
            .order("created_at", { ascending: true });

          if (error) {
            console.error("Error al cargar los mensajes:", error);
            return { ...chat, messages: [] };
          }

          return { ...chat, messages: messagesData || [] };
        }) || []
      );

      // Establecer los chats con sus mensajes en el estado
      setChats(chatsWithMessages);
    }

    fetchChats();
  }, [user?.sender_mongo_id]); // Dependencia de user?.sender_mongo_id
  const getReceiverId = () => {
    if (chat && user) {
      return chat.user1 === user.sender_mongo_id ? chat.user2 : chat.user1; // Determinar el receptor dependiendo del user.sender_mongo_id
    }
    return "";
  };
  useEffect(() => {
    if (activeChat) {
      // Buscar el chat que corresponde al id de activeChat
      const foundChat = chats.find((c) => c.id === activeChat.id);

      // Establecer el chat encontrado o null si no lo encontramos
      setChat(foundChat ?? null); // Establece `null` si no se encuentra el chat
    }
  }, [activeChat, chats]);
  useEffect(() => {
    if (!chat) return; // Si no hay chat seleccionado, no hacer nada

    async function fetchMessages() {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chat?.id) // Usar chat.id para obtener los mensajes correspondientes
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar los mensajes:", error);
        setErrorMessage("Error al cargar los mensajes.");
      } else {
        setMessages(data || []);
      }
    }

    fetchMessages();

    // Suscribirse a mensajes en tiempo real
    const subscription = supabase
      .channel("realtime messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new && "id" in payload.new) {
            setMessages((prev) => [...prev, payload.new as Message]); // Añadir mensaje a la lista de mensajes
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Limpiar la suscripción
    };
  }, [chat]); // Recargar los mensajes cada vez que cambie el chat

  // Obtener el nombre del otro usuario desde MongoDB
  useEffect(() => {
    const fetchReceiverName = async () => {
      /*    const receiverId = getReceiverId();
         if (!receiverId) return;
    */
      try {
        const response = await fetch(`${API_LOCAL}/messages`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          mode: "cors",
          body: JSON.stringify({ chats: chats }),
          credentials: "include"
        });
        const data = await response.json();
        if (data) {
          setReceivers(data.data);
        }
        console.log(data.data)
      } catch (error) {
        console.error("Error obteniendo el nombre del receptor:", error);

      }
    };

    fetchReceiverName();
  }, [chats]);
  useEffect(() => {
    const fetchReceiverName = async () => {
      const receiverId = getReceiverId();

      if (!receiverId) return;
      console.log(receiverId);

      try {
        const response = await fetch(`${API_LOCAL}/messages/${receiverId}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
          mode: "cors",
          credentials: "include",
        });

        const data = await response.json();
        console.log(data);
        setReceiver(data.data || "Usuario desconocido");
      } catch (error) {
        console.error("Error obteniendo el nombre del receptor:", error);
      }
    };

    fetchReceiverName();
  }, [chat]); // Esta dependencia debería estar solo en `chat`, ya que cuando cambia el chat es cuando necesitas obtener un nuevo receptor
  
  // Este useEffect se activará cuando `receiver` cambie y solo hará la petición de `title` si `receiver` no es nulo
  useEffect(() => {
    if (receivers.length > 0 && receiver) {
      fetchTitleOfAdvise();
    }
  }, [chats,receivers, receiver]); // Aquí estamos pendientes del cambio de `receiver`
  const fetchTitleOfAdvise = async () => {
    
    
    console.log(receiver)
    try {
      const response = await fetch(`${API_LOCAL}/title-of-advise/${receiver?._id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
        mode: "cors",
        credentials: "include",
      });
      const data = await response.json();
      setTitleAdvise(data.data || "Titulo no procesado.");
    } catch (error) {
      console.error("Error obteniendo el nombre del receptor:", error);
    }
  };



  return (
    <ChatContext.Provider value={{
      chat, chats, activeChat, setActiveChat, user, setUser, setChats, receiver, messages, setMessages, receivers, setReceivers, setChat, titleAdvise
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat debe usarse dentro de ChatProvider");
  return context;
};
