import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useChat } from "@/context/ctx";
import { es } from "date-fns/locale";
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de instalar uuid si no lo tienes: npm install uuid
import { validateMessage } from "@/hooks/block_word_chat"
import { format } from "date-fns";
import { API_LOCAL } from "@/hooks/apis";




export default function ChatWindow({ onBack }: { onBack: () => void }) {
  /*   const [messages, setMessages] = useState<Message[]>([]); */
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { activeChat, user, receiver, messages, /* getReceiverId */receivers, titleAdvise } = useChat(); // user contiene el usuario autenticado
  /*  const [chat, setChat] = useState<Chat | null>(null); */
  /*  const [receiverName, setReceiverName] = useState<User | null>(null);
  */

  /*   // Obtener el nombre del otro usuario desde MongoDB
    useEffect(() => {
      const fetchReceiverName = async () => {
        const receiverId = getReceiverId();
        if (!receiverId) return;
  
        try {
          const response = await fetch(`${API_LOCAL}/messages/${receiverId}`, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            },
            mode: "cors",
            credentials: "include"
          });
          const data = await response.json();
          setReceiverName(data.data || "Usuario desconocido");
        } catch (error) {
          console.error("Error obteniendo el nombre del receptor:", error);
        
        }
      };
  
      fetchReceiverName();
    }, [chat, user]); */

  // Establecer el chat actual
  /*   useEffect(() => {
      if (activeChat) {
        // Buscar el chat que corresponde al id de activeChat
        const foundChat = chats.find((c) => c.id === activeChat.id);
  
        // Establecer el chat encontrado o null si no lo encontramos
        setChat(foundChat); // Establece `null` si no se encuentra el chat
      }
    }, [activeChat, chats]);
  
   */
  // Cargar mensajes cuando el chat cambie
  /*   useEffect(() => {
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
   */
  // Obtener el receptor del mensaje
  /*   const getReceiverId = () => {
      if (chat && user) {
        return chat.user1 === user.sender_mongo_id ? chat.user2 : chat.user1; // Determinar el receptor dependiendo del user.sender_mongo_id
      }
      return null;
    }; */

  const sendMessage = async () => {
    const isValid = validateMessage(text)
    if (!isValid) {
      setErrorMessage("No podes mandar datos personales.")
      setTimeout(() => {
        setErrorMessage("")
      }, 3000)
      setText("")
      return
    }
    if (text.trim() === "") return; // Si el texto está vacío, no enviar el mensaje

    /*     const receiverId = getReceiverId(); // Obtener el ID del receptor
     */
    /*   if (!receiverId) {
        console.error("No se pudo determinar el receptor del mensaje.");
        setErrorMessage("No se pudo determinar el receptor del mensaje.");
        return;
      } */

    // Asegúrate de que chat?.id y user?.sender_mongo_id no sean null o undefined
    if (!activeChat?.id || !user?.sender_mongo_id || activeChat.id === "" || user.sender_mongo_id === null) {
      console.error("Faltan datos necesarios: chat.id o user.sender_mongo_id no están definidos.");
      setErrorMessage("Faltan datos necesarios.");
      return;
    }

    const messageId = uuidv4();
    try {
      // Realiza la inserción del mensaje en la base de datos de Supabase
      console.log(receiver)
      const { data, error } = await supabase
        .from("messages")
        .insert([{
          id: messageId,
          chat_id: activeChat.id, // Usar chat.id
          sender_mongo_id: user.sender_mongo_id,  // Usar user.sender_mongo_id
          receiver: receiver?.sender_mongo_id,           // Receptor determinado por la función getReceiverId
          text,                          // El mensaje que el usuario envió
          created_at: new Date().toISOString() // Fecha y hora de la creación del mensaje (opcional, si tu base de datos no lo maneja automáticamente)
        }]);

      if (error) {
        console.error("Error al enviar el mensaje:", error);
        setErrorMessage("Error al enviar el mensaje.");
      } else {
        console.log("Mensaje insertado con éxito:", data);
        setText(""); // Limpiar el campo de texto después de enviar el mensaje
        setErrorMessage(null); // Limpiar el mensaje de error si es exitoso
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrorMessage("Ocurrió un error inesperado.");
    }
  };
  console.log(titleAdvise)
  return (
    <div className="flex flex-col h-screen bg-gray-100 w-full  mx-auto border-l border-r">
      <div className="p-4  border-b bg-white">
        <button className="md:hidden mr-4" onClick={onBack}>🔙</button>
        <p className="mr-4 font-roboto">
  Conectaste con {receiver?.name || "desconocido"} a las {" "}
  {activeChat?.created_at ? (
    format(new Date(activeChat.created_at), "HH:mm dd-MM-yy", { locale: es })
  ) : (
    "fecha desconocida"
  )}
</p>

        <p className="mr-4 font-roboto">Por aviso de <strong>{titleAdvise ? titleAdvise: "Cargando..."}</strong></p>
      </div>
      {errorMessage && (
        <div className="bg-red-500 text-white p-2 mb-4 rounded">{errorMessage}</div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages?.length ? (
          messages.map((msg, index) => {
            // Determinar si el mensaje fue enviado por el usuario autenticado
            const isUserMessage = msg.sender_mongo_id === user?.sender_mongo_id;

            // Buscar en receivers el nombre del otro participante
            const otherUserData = receivers.find(
              (r) =>
                r.user1 === msg.sender_mongo_id || r.user2 === msg.sender_mongo_id
            );



            // Determinar el nombre del otro participante basado en el sender_mongo_id
            let otherParticipantName = "Usuario desconocido";

            if (otherUserData) {
              // Verificar cuál es el nombre correcto dependiendo de quién haya enviado el mensaje
              otherParticipantName =
                msg.sender_mongo_id === otherUserData.user1
                  ? otherUserData.name_one
                  : otherUserData.name_two;
            }

            return (
              <div key={index} className="flex flex-col">
                <div
                  className={`p-2 mt-5 rounded-full px-3 shadow-lg max-w-xs ${isUserMessage
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-white self-start mr-auto"
                    }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`text-xs pt-2 ${isUserMessage ? "self-end mr-2" : "self-start ml-2"
                    }`}
                >
                  {isUserMessage ? "Tú" : otherParticipantName} -{" "}
                  {format(new Date(msg.created_at), "HH:mm dd-MM-yy", { locale: es })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500">No hay mensajes en este chat.</div>
        )}
      </div>
      <div className="sticky bottom-0 bg-white p-4 border-t flex items-center w-full">
        <input
          className="flex-1 p-2 border rounded-lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
