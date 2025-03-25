import { API_LOCAL, API_URL } from '@/hooks/apis';
import { FC, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { supabase } from '@/supabase';
import { v5 as uuidv5 } from 'uuid';
import { useChat } from '@/context/ctx';
import ClickOutside from '../ClickOutside';

// Interfaces
interface User {
  _id: string;
  email: string;
  name: string;
  typeAccount: string;
  name_one: string;
  name_two: string;
  user1: string;
  user2: string;
  sender_mongo_id: string;
}

interface Applys {
  status: string;
  userId: string;
  _id: string;
}

interface Advise {
  _id: string;
  name: string;
  email: string;
  description: string;
  languages: string[];
  especialities: string[];
  modality: string;
  subs: string[];
  applys: Applys[];
  publishedAt: Date;
}

interface ApiResponse {
  data: User[];
}

const ListaPacientes: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pacientes, setPacientes] = useState<User[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<"select" | "discard" | null>(null);
  const [selectedPostulante, setSelectedPostulante] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const { user } = useChat();
  const { id } = useParams<{ id: string }>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const navigate = useNavigate()
  useEffect(() => {
    const obtenerPacientes = async () => {
      try {
        const response = await fetch(`${API_URL}/get-applies-of-offer/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: "cors",
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Error al obtener pacientes');

        const result: ApiResponse = await response.json();

        if (result.data && Array.isArray(result.data)) {
          setPacientes(result.data);
        } else {
          throw new Error('Los datos de pacientes no están en el formato esperado');
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    obtenerPacientes();
  }, [id]);

  const toggleDropdown = (postulanteId: User) => {
    setOpenDropdown(openDropdown === postulanteId._id ? null : postulanteId._id);
  };

  const openConfirmModal = (postulanteId: User, action: "select" | "discard") => {
    setSelectedPostulante(postulanteId);
    setSelectedAction(action);
    setModalOpen(true);
    setOpenDropdown(null);
  };
  const sendToMongo = async (p: User) => {
    setActionLoading(true); // Activar el estado de carga

    try {
      const data = await fetch(`${API_URL}/change-status-of-applie`, {
        method: "POST",
        body: JSON.stringify({ user: p._id, adviseId: id }), // Enviamos los datos como JSON
        mode: "cors", // Configuramos el CORS
        credentials: "include", // Incluye cookies si es necesario
        headers: {
          'Content-Type': 'application/json', // Indicamos que enviamos JSON
        },
      });

      const res = await data.json(); // Parseamos la respuesta en JSON

      if (data.ok) {
        console.log("Enviado con éxito", res);
        // Aquí puedes agregar lógica si la respuesta es exitosa
      } else {
        console.log("Error en el envío", res);
        // Aquí puedes manejar casos cuando la respuesta no es exitosa
      }
    } catch (err) {
      console.error("Error al enviar los datos:", err);
      // Manejo de errores en caso de que falle la solicitud
    } finally {
      setActionLoading(false); // Desactivar el estado de carga
    }
  };

  const sendToSupabase = async (p: User) => {
    setActionLoading(true)

    // Si el user.id es un ObjectId de MongoDB, lo convertimos a string para trabajar con UUID

    try {
      const { data, error } = await supabase
        .from("chats")
        .insert([{
          user1: p.sender_mongo_id,  // Usamos sender_mongo_id del postulante
          user2: user?.sender_mongo_id,          // Usamos el UUID del user autenticado
          created_at: new Date().toISOString()  // Fecha de creación
        }]);
      setTimeout(() => {
        navigate("/mensajes")
      }, 2000)

      setActionLoading(false)
      if (error) {
        console.error("Error al enviar el mensaje:", error);
        setErrorMessage("Error al enviar el mensaje.");
      } else {
        console.log("Mensaje insertado con éxito:", data);
        setText("");  // Limpiar el campo de texto después de enviar el mensaje
        setErrorMessage(null);  // Limpiar mensaje de error si es exitoso
      }
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setActionLoading(false)
    }
  };

  const confirmAction = async () => {
    if (!selectedAction || !selectedPostulante) return;
    console.log(selectedPostulante);
    setActionLoading(true);

    try {
      if (selectedAction === "select") {
        await sendToSupabase(selectedPostulante);
        await sendToMongo(selectedPostulante)
      } else {
        console.log(`❌ Postulante descartado: ${selectedPostulante}`);
      }
    } catch (error) {
      console.error("Error en la acción:", error);
    } finally {
      setActionLoading(false);
      setModalOpen(false);
      setSelectedPostulante(null);
      setSelectedAction(null);
    }
  };

  return (
    <div className='container mx-auto max-w-7xl text-center mt-10 pt-10'>
      <Breadcrumb pageName="Postulaciones" number={pacientes.length} />

      {loading ? <p>Cargando solicitudes...</p> : null}
      {error ? <p className="text-red-500">{error}</p> : null}

      <ul className="space-y-4 z-[-1]">
        {pacientes.map((postulante) => (
          <ClickOutside onClick={() => setOpenDropdown(null)}>
            <li key={postulante._id} className="flex mb-3 items-center z-0 justify-between rounded-xl text-left overflow-hidden border border-gray-200 p-6 bg-white transition duration-200 mb-3">
              <div className="flex flex-col text-left">
                <span className="text-sm sm:text-lg text-gray-500">UY</span>
                <span className="text-sm sm:text-lg font-semibold font-inter">{postulante.name}</span>
                <span className="text-gray-500">{postulante.email}</span>
              </div>

              <div className="relative">
                <button
                  className="text-gray-600 hover:text-black focus:outline-none"
                  onClick={() => toggleDropdown(postulante)}
                >
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>

                {openDropdown === postulante._id && (


                  <div className="fixed left-[calc(100%-180px)] sm:left-[calc(100%-400px)] rounded-xl  mt-2 w-36 bg-white border rounded-lg shadow-lg">
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
                      onClick={() => openConfirmModal(postulante, "select")}
                    >
                      ✅ Seleccionar
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
                      onClick={() => openConfirmModal(postulante, "discard")}
                    >
                      ❌ Descartar
                    </button>
                    <Link
                      to={`/postulantes/${postulante._id}/perfil`}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
                    >
                      👤 Ver perfil
                    </Link>
                  </div>
                )}
              </div>
            </li>
          </ClickOutside>
        ))}
      </ul>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {selectedAction === "select" ? "Confirmar selección" : "Confirmar descarte"}
            </h2>
            <p className="mb-4">
              {selectedAction === "select"
                ? "¿Estás seguro de que quieres seleccionar a este postulante? Se creará un chat para comunicarse."
                : "¿Estás seguro de que quieres descartar a este postulante?"}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setModalOpen(false)}
                disabled={actionLoading}
              >
                Cancelar
              </button>
              <button
                className={`px-4 py-2 rounded text-white ${selectedAction === "select" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                onClick={confirmAction}
                disabled={actionLoading}
              >
                {actionLoading ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaPacientes;
