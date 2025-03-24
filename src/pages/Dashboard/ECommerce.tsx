import NotificationCard from "@/components/notifications_card";
import ProfileCard from "@/components/notifications_profil_card";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { format, formatDistanceToNow, parseISO } from 'date-fns'; // Importamos la función para calcular el tiempo transcurrido
import { es } from 'date-fns/locale'; // Importamos la configuración regional en español
import { API_LOCAL, API_URL } from "@/hooks/apis";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
interface PriceRange {
  min: number;
  max: number;
}
interface DeliveryDate {
  deliveryDate: string
}

interface Advise {
  _id: string;
  title: string;
  description: string;
  languages: string[];
  especialities: string[]; // Agrega la especialidad al formulario de edición de usuario
  modality: string; // Agrega la especialidad al formulario de edición de usuario
  subs: string[];
  applys: string[],
  priceRange?: PriceRange;
  endDateProject: DeliveryDate,
  fixedPrice: string
  publishedAt: string
}
interface ApiResponse {
  data: Advise[];
}
export default function CardsList() {
  const nv = useNavigate()
  const [avisos, setAvisos] = useState<Advise[]>([]);
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    const obtenerPacientes = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/get-advises`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: "cors",
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Error al obtener avisos');
        const result: ApiResponse = await response.json();

        // Verificamos que 'result.data' sea un arreglo de pacientes
        if (result.data && Array.isArray(result.data)) {
          setAvisos(result.data); // Asignamos los pacientes al estado
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
console.log(avisos)
  return (
    <>
      {/* <div className="flex"> */}
        <div className="container mx-auto mt-10 pt-10   max-w-7xl text-center">

          <Breadcrumb pageName="Mis avisos" number={0}/>

          <div className=" gap-4 mt-5">
            {avisos.map((job, index) => (
              <div key={index} className="rounded-xl text-left overflow-hidden border border-gray-200 p-6 bg-white transition duration-200 mb-3">
                <span className="text-xs sm:text-sm text-black">
                  Se entrega el {format(parseISO(job.endDateProject.deliveryDate), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>

                <h2 className="font-semibold font-inter text-xl mb-2 text-black cursor-pointer hover:text-blue-800 transition duration-200" onClick={() => nv(`/avisos/${job._id}`)}>{job.title}</h2>
                <div className="flex justify-start my-2 items-center space-x-4 text-sm text-gray-500">
                  <span className="font-bold text-black">${job.priceRange?.min} - ${job.priceRange?.max}</span>
                  {/*   <span>{job.modalidad}</span>
                <span>•</span> */}
                  <FontAwesomeIcon icon={faUser} className="text-sm" />
                  {/*   <span className="text-gray-400">•</span> */}
                  {
                    job.applys?.length > 0 ?
                      <Link to={`/postulantes/${job._id}`} className="font-medium text-gray-700 hover:underline">Ver {job.applys?.length} aplicantes</Link> : <span className="font-medium text-gray-700">0 aplicantes</span>
                  }
                </div>
                <p className="text-gray-600 mt-2 leading-relaxed break-words">{job.description.slice(0, 100)}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.especialities.map((habilidad, i) => (
                    <span key={i} className="nline-block bg-blue-200 text-blue-800 rounded-full px-3 py-1 font-inter text-sm font-semibold mr-2 mb-2">{habilidad}</span>
                  ))}
                </div>
             
                <div className="text-right bottom-2 right-2 text-xs text-gray-500">
                  <span>Publicado </span>{formatDistanceToNow(parseISO(job.publishedAt), { addSuffix: true, locale: es })}
                </div>
              </div>
            ))}
          </div>
        </div>
    
    </>
  );
}