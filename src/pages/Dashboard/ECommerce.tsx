import { useNavigate } from "react-router-dom";

export default function CardsList() {
  const nv = useNavigate()
  const jobs = [
    {
      id: 1,
      title: "Desarrollador Frontend",
      description: "Buscamos un desarrollador con experiencia en React y Tailwind CSS.",
      modalidad: "Remoto",
      salario: "$3,000/mes",
      aplicantes: "15 postulantes",
      habilidades: ["React", "Tailwind CSS", "JavaScript", "Redux", "Git", "REST API"]
    },
    {
      id: 2,
      title: "Diseñador UX/UI",
      description: "Se necesita un diseñador con habilidades en Figma y prototipado.",
      modalidad: "Híbrido",
      salario: "$2,500/mes",
      aplicantes: "10 postulantes",
      habilidades: ["Figma", "Adobe XD", "Prototipado", "Investigación UX", "HTML/CSS"]
    },
    {
      id: 3,
      title: "Gerente de Producto",
      description: "Oportunidad para liderar el desarrollo de nuevos productos digitales.",
      modalidad: "Presencial",
      salario: "$4,500/mes",
      aplicantes: "8 postulantes",
      habilidades: ["Gestión de Producto", "Scrum", "Metodologías Ágiles", "Data Analysis", "Stakeholder Management"]
    },
  ];

  return (
    <div className="flex  min-h-screen bg-gray-100">
      <div className="container mx-auto   max-w-3xl text-center">
        <h1 className="text-2xl text-left text-gray-800 font-bold mb-6">Ofertas de trabajo</h1>
        <div className="grid gap-4">
          {jobs.map((job, index) => (
            <div key={index} className="bg-white text-left p-4 rounded  border-2 border-gray-300">
              <h2 className="text-lg font-semibold text-black hover:cursor-pointer hover:underline" onClick={() => nv(`/avisos/${job.id}`)}>{job.title}</h2>
              <div className="flex justify-start my-2  space-x-4 text-sm text-gray-500">
                <span>{job.modalidad}</span>
                <span>•</span>
                <span>{job.salario}</span>
                <span>•</span>
                <span>{job.aplicantes}</span>
              </div>
              <p className="text-gray-600 mt-2">{job.description.slice(0, 100)}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {job.habilidades.map((habilidad, i) => (
                  <span key={i} className="bg-blue-300 text-white px-2 py-1 text-xs rounded">{habilidad}</span>
                ))}
              </div>
            
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}