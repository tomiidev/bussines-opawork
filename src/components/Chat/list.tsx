import { useChat } from "@/context/ctx";

// Cargar chats del usuario
export function ListofChats({ onSelectChat }: { onSelectChat: () => void }) {
  const { chats, setActiveChat, activeChat, user, receivers, titleAdvise } = useChat();

  return (
    <div className="h-full overflow-y-auto">
      {chats.length === 0 ? (
        <p className="text-gray-500">No tienes chats aún.</p>
      ) : (
        chats.map((chat) => {
          // Determinar el ID del otro usuario en la conversación comparando con el user autenticado
          const otherUserId = chat.user1 === user?.sender_mongo_id ? chat.user2 : chat.user1;

          // Buscar en receivers el chat que contiene ese user1 y user2
          const receiverData = receivers.find(
            (r) => r.user1 === otherUserId || r.user2 === otherUserId
          );



          // Obtener el nombre del participante basado en el otherUserId
          let otherParticipantName = "Usuario desconocido";

          if (receiverData) {
            // Si encontramos la data del receptor, seleccionamos el nombre adecuado
            // Si otherUserId coincide con user1, muestra name_one; si coincide con user2, muestra name_two
            otherParticipantName =
              otherUserId === receiverData.user1
                ? receiverData.name_one
                : receiverData.name_two;
          }

          return (
            <button
              key={chat.id}
              onClick={() => {
                setActiveChat(chat);
                onSelectChat();
              }}
              className={`p-4 w-full cursor-pointer border-b font-roboto text-left hover:bg-gray-300 ${activeChat?.id === chat.id ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
              {/* Fila 1: Nombre del otro participante */}
              <div className="flex justify-between items-center">
                <span className="font-bold">{otherParticipantName}</span>
              </div>

              {/* Fila 2: Título del aviso */}
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-500">Por aviso de <strong>{titleAdvise ? titleAdvise: "Cargando..."}</strong></span>
              </div>
            </button>

          );
        })
      )}
    </div>
  );
}

export default ListofChats;
