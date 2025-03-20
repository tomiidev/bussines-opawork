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

  return (
    <>
      {/* <div className="flex"> */}
        <div className="container mx-auto   max-w-7xl text-center">

          <h2 className="text-lg font-semibold text-black  text-left">Mis avisos</h2>

          <div className=" gap-4 mt-5">
            {avisos.map((job, index) => (
              <div key={index} className=" text-left p-4   border-b hover:bg-gray-100 z-0]">
                <span className="text-xs sm:text-sm text-black">
                  Se entrega el {format(parseISO(job.endDateProject.deliveryDate), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>

                <h2 className="text-lg sm:text-xl font-roboto mt-2 text-black hover:cursor-pointer hover:underline" onClick={() => nv(`/avisos/${job._id}`)}>{job.title}</h2>
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
                    <span key={i} className="hover:border-blue-300 border-2 text-gray-800 hover:text-blue-500 cursor-pointer px-2 py-1 text-xs sm:text-sm rounded">{habilidad}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.subs.map((habilidad, i) => (
                    <span key={i} className="hover:border-blue-300 border-2 text-gray-800 hover:text-blue-500 cursor-pointer px-2 py-1 text-xs sm:text-sm rounded">{habilidad}</span>
                  ))}
                </div>
                <div className="text-right bottom-2 right-2 text-xs text-gray-500">
                  <span>Publicado </span>{formatDistanceToNow(parseISO(job.publishedAt), { addSuffix: true, locale: es })}
                </div>
              </div>
            ))}
          </div>
        </div>
     {/*  </div> */}
      <Footer />
    </>
  );
}