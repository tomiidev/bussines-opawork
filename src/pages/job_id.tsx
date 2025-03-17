import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faClockFour, faClockRotateLeft, faMoneyBill, faMoneyBill1Wave, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type Job = {
  id: number,
  companyLogo: "",
  title: string;
  description: string;
  modalidad: string;
  salario: string;
  aplicantes: number;
  habilidades: string[];
  languages: string[];
  detalles: string;
  availability: string;
  isVerified: boolean,
  publishedAt: Date,
};

const jobs: Job[] = [{
  id: 1,
  detalles: "",
  isVerified: true,
  companyLogo: "",
  title: "Desarrollador Frontend",
  description: "Buscamos un desarrollador con experiencia en React y Tailwind CSS.",
  modalidad: "Remoto",
  salario: "$3,000/mes $3500/mes",
  aplicantes: 15,
  availability: "Tiempo completo",
  habilidades: ["React", "Tailwind CSS", "JavaScript", "Redux", "Git", "REST API"],
  languages: [
    "Español", "Inglés"
  ],
  publishedAt: new Date('2025-03-12T10:00:00'),
}];

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (id) {
      const foundJob = jobs[Number(id) - 1] || null;
      setJob(foundJob);
    }
  }, [id]);

  // Verifica si el trabajo existe
  if (!job) {
    return <p className="text-center text-gray-500">Trabajo no encontrado</p>;
  }

  return (
    <>
    <div className="flex container justify-start max-w-7xl   mx-auto">
  
      <button
        onClick={() => navigate("/")}
        className="text-blue-500 text-sm mb-6"
      >
        ← Volver a la lista
      </button>
    </div>
  
    <div className="flex container max-w-7xl mx-auto gap-5 mt-2 flex-col md:flex-row"> {/* flex-col en móviles, flex-row en pantallas grandes */}
      <div className="flex container mx-auto w-full bg-white text-left p-4 rounded border-2 border-gray-300">
  
        {/* Columna izquierda (contenedor principal) */}
        <div className="flex flex-col flex-grow w-full md:w-2/3 mr-6"> {/* w-full en móviles, w-2/3 en pantallas grandes */}
          {/* Sección en fila con imagen de empresa + título */}
          <div className="flex items-center space-x-4 mb-4">
            {/* Imagen de la empresa */}
            <div className="relative">
              <img
                src={job.companyLogo || "/placeholder-logo.png"} // Imagen de la empresa
                alt="Logo de la empresa"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg border"
              />
              {/* Flag de cuenta verificada */}
            </div>
  
            {/* Título y detalles */}
            <div>
              <h2 className="text-xl sm:text-4xl font-bold text-black">{job.title}</h2>
              <div className="flex text-xs flex-wrap space-x-2 sm:space-x-3 text-gray-500 mt-2">
                <FontAwesomeIcon icon={faUser} className="text-sm" />
                <span className="font-medium text-gray-700">{job.aplicantes} aplicantes</span>
                <FontAwesomeIcon icon={faClockFour} className="text-sm" />
                <span className="font-medium text-gray-700">{formatDistanceToNow(new Date(job.publishedAt), { addSuffix: true, locale: es })}</span>
                {job.isVerified && (
                  <span className=" bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    ✔ Cuenta verificada
                  </span>
                )}
              </div>
            </div>
          </div>
  
          <span className=" text-black font-bold text-xl mt-2 mb-3">{job.salario}</span>
  
          {/* Descripción del trabajo */}
          <div className="text-gray-700 mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Descripción del trabajo</h3>
            <p className="leading-relaxed">{job.description}</p>
          </div>
  
          <div className="text-gray-700 mb-6 flex items-center space-x-2">
            <FontAwesomeIcon icon={faClock} className="text-sm" />
            <p className="leading-relaxed">{job.availability}</p>
          </div>
  
          {/* Habilidades requeridas */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Habilidades requeridas</h3>
            <div className="flex flex-wrap gap-3">
              {job.habilidades.map((habilidad, i) => (
                <span key={i} className="hover:border-blue-300 border-2 text-gray-800 hover:text-blue-500 cursor-pointer px-3 py-2 text-xs rounded-full">
                  {habilidad}
                </span>
              ))}
            </div>
          </div>
  
          {/* Especificaciones */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Especificaciones</h3>
            <div className="flex flex-wrap gap-3">
              {job.habilidades.map((habilidad, i) => (
                <span key={i} className="hover:border-blue-300 border-2 text-gray-800 hover:text-blue-500 cursor-pointer px-3 py-2 text-xs rounded-full">
                  {habilidad}
                </span>
              ))}
            </div>
          </div>
  
          {/* Lenguajes requeridos */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Lenguajes requeridos</h3>
            <div className="flex flex-wrap gap-3">
              {job.languages.map((habilidad, i) => (
                <span key={i} className="hover:border-blue-300 border-2 text-gray-800 hover:text-blue-500 cursor-pointer px-3 py-2 text-xs rounded-full">
                  {habilidad}
                </span>
              ))}
            </div>
          </div>
  
          {/* Botón para postularse */}
          <div className="mt-6 justify-between flex items-center space-x-3">
            <span className="font-medium text-gray-700 underline"><i>Pago completo al final del proyecto</i></span>
            <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors duration-300">
              Postularse
            </button>
          </div>
        </div>
  
      </div>
      
    </div>
  </>
  



  );
};

export default JobDetail;
