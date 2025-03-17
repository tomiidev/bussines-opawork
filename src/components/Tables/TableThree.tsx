import { API_LOCAL, API_URL } from '@/hooks/apis';
import { FC, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { formatDateToDMY } from '@/hooks/dates';

// Interfaz para el paciente
interface PriceRange {
  min: number;
  max: number;
}

interface Advise {
  _id: string;
  name: string;
  email:string,
  description: string;
  languages: string[];
  especialities: string[]; // Agrega la especialidad al formulario de edición de usuario
  modality: string; // Agrega la especialidad al formulario de edición de usuario
  subs: string[];
  applys: string[],
  priceRange?: PriceRange;
  publishedAt: Date
}
interface ApiResponse {
  data: Advise[];
}
const ListaPacientes: FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Advise | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Estado para manejar la lista de pacientes
  const [pacientes, setPacientes] = useState<Advise[]>([]);
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    const obtenerPacientes = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_LOCAL}/get-applies-of-offer/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: "cors",
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Error al obtener pacientes');
        const result: ApiResponse = await response.json();

        // Verificamos que 'result.data' sea un arreglo de pacientes
        if (result.data && Array.isArray(result.data)) {
          setPacientes(result.data); // Asignamos los pacientes al estado
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
  }, []); // Se ejecuta solo una vez al montar el componente
console.log(pacientes)
  // Estado para manejar los datos del formulario
/*   const [formData, setFormData] = useState<Advise>({
    _id: "",
    name: '',
    applys: [],
    description: "",
    especialities: [],
    languages: [],
    modality: "",
    publishedAt: Date.now(),
    subs: [],
    priceRange: {
      min: 0,
      max: 0
    }

  }); */

  // Estado para manejar si el modal está abierto o cerrado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPatientToDelete(null);
  };
  // Estado para manejar si estamos editando un paciente
  const [isEditing, setIsEditing] = useState(false);

  // Función para eliminar un paciente
  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (patientToDelete) {
      setLoading(true)
      try {
        const response = await fetch(`${API_URL}/delete-patient`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({ patientToDelete })
        });

        if (!response.ok) throw new Error('Error al eliminar el paciente');

        setPacientes((prevPacientes) => prevPacientes.filter((p) => p._id !== patientToDelete._id));

        setShowDeleteModal(false);
        setPatientToDelete(null);
      } catch (error) {
        console.error('Error eliminando el paciente:', error);
      }
      finally {
        setLoading(false)
        setShowDeleteModal(false);
        setPatientToDelete(null);
      }
    }
  };

  const jobs = [
    {
      id: 1,
      title: "Desarrollador Frontend",
      description: "Buscamos un desarrollador con experiencia en React y Tailwind CSS.",
      modalidad: "Remoto",
      salario: "$3,000/mes",
      aplicantes: "15 postulantes",
      habilidades: ["React", "Tailwind CSS", "JavaScript", "Redux", "Git", "REST API"],
      enEspera: false,
    },
    {
      id: 2,
      title: "Diseñador UX/UI",
      description: "Se necesita un diseñador con habilidades en Figma y prototipado.",
      modalidad: "Híbrido",
      salario: "$2,500/mes",
      aplicantes: "10 postulantes",
      habilidades: ["Figma", "Adobe XD", "Prototipado", "Investigación UX", "HTML/CSS"],
      enEspera: true,
    },
    {
      id: 3,
      title: "Gerente de Producto",
      description: "Oportunidad para liderar el desarrollo de nuevos productos digitales.",
      modalidad: "Presencial",
      salario: "$4,500/mes",
      aplicantes: "8 postulantes",
      habilidades: ["Gestión de Producto", "Scrum", "Metodologías Ágiles", "Data Analysis", "Stakeholder Management"],
      enEspera: true,
    },
  ];



  // Función para actualizar un paciente
  
  /*   const postulantes = [
      {
        id: 1,
        nombre: "Juan Pérez",
        correo: "juanperez@gmail.com",
        habilidades: ["React", "Node.js", "Tailwind CSS"],
        estado: "Pendiente",
      },
      {
        id: 2,
        nombre: "María López",
        correo: "marialopez@gmail.com",
        habilidades: ["Python", "Django", "PostgreSQL"],
        estado: "Pendiente",
      },
      {
        id: 3,
        nombre: "Carlos Gómez",
        correo: "carlosgomez@gmail.com",
        habilidades: ["Angular", "TypeScript", "MongoDB"],
        estado: "Pendiente",
      },
    ];
   */


  return (
    <div className='container mx-auto   max-w-7xl text-center'>
      <Breadcrumb pageName="Postulaciones" number={pacientes.length} />
      <div className="flex justify-end ">
        {/*    <h2 className="text-lg font-semibold">Calendario de citas</h2> */}

      </div>


      {/* <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5  dark:border-strokedark dark:bg-boxdark">
 */}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left">Correo</th>
            {/*   <th className="py-3 px-6 text-left">Habilidades</th> */}
              <th className="py-3 px-6 text-left">Estado</th>
              <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
             {pacientes.map((postulante, index) => (
              <tr key={index} className="border-b hover:bg-gray-100 text-left">
                <td className="py-3 px-6">{postulante.name}</td>
                <td className="py-3 px-6">{postulante.email}</td>
               {/*  <td className="py-3 px-6">
                  <div className="flex flex-wrap gap-2">
                    {postulante.especialities.map((habilidad, i) => (
                      <span key={i} className="hover:border-blue-300 border-2 text-gray-800 hover:text-blue-500 cursor-pointer px-2 py-1 text-xs rounded-full">
                        {habilidad}
                      </span>
                    ))}
                  </div>
                </td> */}
               {/*  <td className="py-3 px-6">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${postulante.state === "Aprobado" ? "bg-green-500 text-white" : postulante.state === "Pendiente" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"}`}>
                    {postulante.state}
                  </span>
                </td> */}
                <td className="py-3 px-6">
                  <Link to={`/postulantes/${postulante._id}/perfil`} className=" text-gray-500  rounded underline">
                    Ver perfil
                  </Link>
                </td>
              </tr>
            ))} 
          </tbody>
        </table>
      </div>


      {/*  </div> */}

    </div>
  );
};

export default ListaPacientes;
