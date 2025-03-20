import { API_LOCAL } from '@/hooks/apis';
import { FC, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { supabase } from '@/supabase';
import { v5 as uuidv5 } from 'uuid';
import { useChat } from '@/context/ctx';

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
        const response = await fetch(`${API_LOCAL}/get-applies-of-offer/${id}`, {
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

  const sendToSupabase = async (p: User) => {
    setActionLoading(true)
    const NAMESPACE = '123e4567-e89b-12d3-a456-426614174000'; // Fijo para derivar UUID v5

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
    <div className='container mx-auto max-w-7xl text-center'>
      <Breadcrumb pageName="Postulaciones" number={pacientes.length} />

      {loading ? <p>Cargando postulantes...</p> : null}
      {error ? <p className="text-red-500">{error}</p> : null}

      <ul className="space-y-4">
        {pacientes.map((postulante) => (
          <li key={postulante._id} className="flex items-center justify-between bg-white p-4 rounded border">
            <div className="flex flex-col text-left">
              <span className="text-sm sm:text-lg text-gray-500">UY</span>
              <span className="text-sm sm:text-lg font-semibold">{postulante.name}</span>
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
                <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-10">
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
