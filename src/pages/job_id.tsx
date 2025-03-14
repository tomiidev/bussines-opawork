import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

type Job = {
  id: number,
  title: string;
  description: string;
  modalidad: string;
  salario: string;
  aplicantes: number;
  habilidades: string[];
  languages: string[];
  detalles: string;
  availability: string;
};

const jobs: Job[] = [{
  id: 1,
  detalles: "",
  title: "Desarrollador Frontend",
  description: "Buscamos un desarrollador con experiencia en React y Tailwind CSS.",
  modalidad: "Remoto",
  salario: "$3,000/mes",
  aplicantes: 15,
  availability: "Tiempo completo",
  habilidades: ["React", "Tailwind CSS", "JavaScript", "Redux", "Git", "REST API"],
  languages: [
    "Español", "Inglés"
  ]
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
      <div className="flex flex-col  bg-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 text-sm mb-6 self-center"
        >
          ← Volver a la lista
        </button>
        <div className="flex flex-col flex-grow container mx-auto max-w-3xl bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-300">
          {/* Título del trabajo */}
          <h2 className="text-xl sm:text-3xl font-bold text-black mb-4">{job.title}</h2>

          {/* Información adicional del trabajo */}
          <div className="flex text-xs flex-wrap space-x-2 sm:space-x-6 w-full  text-sm sm:text-sm text-gray-500 mb-6">
            <span className="font-medium text-gray-700">{job.modalidad}</span>
            <span className="text-gray-400">•</span>
            <span className="font-medium text-gray-700">{job.salario}</span>
            <span className="text-gray-400">•</span>
            <span className="font-medium text-gray-700">{job.aplicantes} aplicantes</span>
          </div>

          <div className="text-gray-700 mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Disponibilidad horaria</h3>
            <p className="leading-relaxed">{job.availability}</p>
          </div>
          {/* Descripción del trabajo */}
          <div className="text-gray-700 mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Descripción del trabajo</h3>
            <p className="leading-relaxed">{job.description}</p>
          </div>

          {/* Habilidades requeridas */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Habilidades requeridas</h3>
            <div className="flex flex-wrap gap-3">
              {job.habilidades.map((habilidad, i) => (
                <span key={i} className="bg-blue-300 text-white px-3 py-2 text-xs rounded-full">{habilidad}</span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Especificaciones</h3>
            <div className="flex flex-wrap gap-3">
              {job.habilidades.map((habilidad, i) => (
                <span key={i} className="bg-blue-300 text-white px-3 py-2 text-xs rounded-full">{habilidad}</span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Lenguajes requeridos</h3>
            <div className="flex flex-wrap gap-3">
              {job.languages.map((habilidad, i) => (
                <span key={i} className="bg-blue-300 text-white px-3 py-2 text-xs rounded-full">{habilidad}</span>
              ))}
            </div>
          </div>

          {/* Botón para postularse */}
          <div className="mt-6 justify-end flex">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300">
              Postularse
            </button>
          </div>
        </div>
      </div>
    </>


  );
};

export default JobDetail;
