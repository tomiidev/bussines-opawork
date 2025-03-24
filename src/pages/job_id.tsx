import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faClockFour, faClockRotateLeft, faDollarSign, faHandshake, faMoneyBill, faMoneyBill1Wave, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { API_LOCAL, API_URL } from "@/hooks/apis";
import toast, { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";

interface User {
  _id: string;
  name: string;
  description: string;
  companyLogo: string;
  isVerified: boolean;
  languages: string[];
}

interface PriceRange {
  min: number;
  max: number;
}
interface DeliveryDate {
  deliveryDate: string
}
interface Advise {
  _id: string;
  name: string;
  fixedPrice: "";
  title: string;
  userData: User;
  description: string;
  languages: string[];
  especialities: string[]; // Agrega la especialidad al formulario de edición de usuario
  time: string; // Agrega la especialidad al formulario de edición de usuario
  subs: string[];
  modality: string[];
  applys: string[],
  endDateProject: DeliveryDate,
  priceRange?: PriceRange;
  publishedAt: string;
  jobRelated: Advise[]
}
interface ApiResponse {
  data: Advise;
}
const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Advise | null>();
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const obtenerPacientes = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_LOCAL}/get-advise-by-id/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: "cors",
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Error al obtener aviso');
        const result: ApiResponse = await response.json();

        // Verificamos que 'result.data' sea un arreglo de pacientes
        if (result.data) {
          setJob(result.data); // Asignamos los pacientes al estado
          console.log(result.data)
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
  }, [id]); // Se ejecuta solo una vez al montar el componente



  const handleApply = async (): Promise<void> => {
    setLoading(true)
    try {
      const response = await fetch(`${API_LOCAL}/apply-offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: "cors",
        body: JSON.stringify({ id: id, idbusiness: job?._id }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Error al aplicar');
      const result: ApiResponse = await response.json();

      // Verificamos que 'result.data' sea un arreglo de pacientes
      if (result.data) {
        toast.success("Te postulaste con éxito")
        setTimeout(() => {
          navigate("/")
        }, 1000)
      }

    } catch (err) {
      toast.error("Ya te postulaste o ocurrio un error.")
    } finally {
      setLoading(false);
    }
  };

  /*   // Verifica si el trabajo existe
    if (loading) {
      return <div>Cargando...</div>;
    } */
  /*   useEffect(() => {
      window.location.reload()
    }, [id]) */
  return (
    <>
      <div className="flex mt-10 pt-10  container justify-start min-w-7xl max-w-7xl  mx-auto">

        <button
          onClick={() => navigate("/")}
          className="text-gray-800 font-inter hover:underline text-sm mb-6"
        >
          ← Volver a la lista
        </button>
      </div>

      <div className="flex  container min-w-7xl max-w-7xl mx-auto gap-5 mt-2 flex-col md:flex-row"> {/* flex-col en móviles, flex-row en pantallas grandes */}
        <div className=" rounded-xl text-left overflow-hidden  w-full sm:w-2/3 p-6  bg-white transition duration-200">
          <div className="flex flex-col flex-grow ">
            <div className="flex items-center space-x-4 mb-4">
              <div className="">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-xl sm:text-3xl font-inter font-semibold text-black">
                    {job?.title}
                  </h2>


                </div>

                <div className="flex text-xs items-center flex-wrap space-x-2 sm:space-x-3 text-gray-500 mt-2">
                  <i className="hgi hgi-stroke hgi-user-multiple-02 text-lg"></i>
                  <span className="font-inter text-gray-700 text-xs sm:text-sm">{job?.applys.length} aplicantes</span>
                  <div className="flex items-center gap-1 text-xs sm:text-smm">

                    <i className="hgi hgi-stroke hgi-calendar-03"></i>
                    {job?.publishedAt
                      ? <span className="">Publicado {formatDistanceToNow(parseISO(job.publishedAt), { addSuffix: true, locale: es })}</span>
                      : "Fecha no disponible"}
                    <span>por </span> {job?.userData.name}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-1">

              {job?.endDateProject?.deliveryDate && !isNaN(Date.parse(job.endDateProject.deliveryDate)) ? (
                <span className="text-black">
                  Se entrega el {format(parseISO(job.endDateProject.deliveryDate), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>
              ) : (
                <span className="text-black">Fecha no disponible</span>
              )}
              {/* </div> */}

              {/* <div className="flex items-center gap-1 my-3 justify-end"> */}
              <div>
                <FontAwesomeIcon icon={faDollarSign} className="text-black" />
                <span className="text-gray-800 font-semibold text-sm sm:text-lg">{job?.priceRange?.min} - {job?.priceRange?.max}</span>
              </div>
            </div>
            <div className="text-gray-700 mb-6">
              <h3 className="text-sm sm:text-sm font-bold text-black my-2">Descripción del trabajo</h3>
              <p className="leading-relaxed break-words">{job?.description}</p>
            </div>
            <div className="flex justify-between items-center text-gray-700 mb-6">
              <div className="flex items-center gap-1">
                <i className="hgi hgi-stroke hgi-clock-01 text-lg"></i>
                <p className="leading-relaxed">{job?.time}</p>
              </div>
              <div className="flex items-center gap-1">
                <i className="hgi hgi-stroke hgi-agreement-02 text-lg"></i>
                <p className="leading-relaxed">{String(job?.fixedPrice) === "si" ? "Precio negociable" : "No es negociable"}</p>
              </div>
            </div>
            <div className="pt-4 pb-2">
              {/* <h3 className="text-sm sm:text-sm font-inter text-gray-800 mb-2">Especialidades</h3> */}
              {job?.especialities.map((habilidad, i) => (
                <span key={i} className="inline-block bg-blue-200 text-blue-800 rounded-full font-inter px-3 py-1 text-sm font-semibold mr-2 mb-2">
                  {habilidad}
                </span>
              ))}
            </div>
            <div className=" pt-4 pb-2">
              <h3 className="text-sm sm:text-sm font-inter  text-gray-800 mb-2">Especificaciones</h3>
              {job?.subs.map((habilidad, i) => (
                <span key={i} className="inline-block bg-blue-200 text-blue-800 rounded-full px-3 py-1 text-sm font-inter font-semibold mr-2 mb-2">
                  {habilidad}
                </span>
              ))}
            </div>
            <div className=" pt-4 pb-2">
              <h3 className="text-sm sm:text-sm font-inter  text-gray-800 mb-2">Lenguajes requeridos</h3>
              {job?.languages.map((habilidad, i) => (
                <span key={i} className="inline-block bg-blue-200 text-blue-800 rounded-full px-3 py-1 text-sm font-inter font-semibold mr-2 mb-2">
                  {habilidad}
                </span>
              ))}
            </div>
            <div className="justify-between flex items-center space-x-3">
              <span className="text-gray-500 text-xs sm:text-sm">Pago completo al final del proyecto</span>
              <div className="flex justify-end items-center w-2/3 gap-2">

                {job?.userData.isVerified ? (
                  <span className="bg-transparent text-black  text-xs sm:text-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <i className="hgi hgi-stroke hgi-security-check text-lg"></i> Cuenta verificada
                  </span>
                ) : (
                  <span className="bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full">
                    ✖ Aún no se verificó la cuenta
                  </span>
                )}
                <button
                  onClick={handleApply}
                  disabled={loading}
                  className={`bg-blue-500 hidden sm:block rounded-full text-white px-6 py-1 w-1/3 text-xs sm:text-lg hover:bg-blue-600 transition-colors duration-300 ${loading ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : ""}`}
                >
                  {loading ? "Un segundo..." : "Enviar solicitud"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fila inferior (columna de la derecha) */}
        <div className="flex container w-full  sm:w-1/3 mx-auto mt-4 md:mt-0"> {/* Espaciado arriba solo en móviles */}
          <div className=" w-full">
            <h3 className="text-sm sm:text-xl font-inter text-black mb-4">Otras ofertas que te pueden interesar</h3>
            {job?.jobRelated.length ? job?.jobRelated.map((job, index) => (
              <div key={index} className=" rounded-xl text-left overflow-hidden  p-6  bg-white transition duration-200 mb-3">
                <h2 className="text-lg font-inter text-black font-semibold hover:cursor-pointer hover:text-blue-800" onClick={() => navigate(`/avisos/${job._id}`)}>{job.title}</h2>
                <div className="flex justify-start my-2 items-center  space-x-2 text-sm text-gray-500">
                  {/*   <span>{job.modalidad}</span>
                <span>•</span> */}
                  <span className="font-bold text-black">{job.name}</span>
                  <i className="hgi hgi-stroke hgi-user-multiple-02 text-lg"></i>
                  {/*   <span className="text-gray-400">•</span> */}
                  <span className="font-medium text-gray-700">{job.applys.length} aplicantes</span>
                </div>
                <p className="text-gray-600 mt-2 leading-relaxed break-words">{job.description.slice(0, 100)}</p>
                {/*   <div className="flex flex-wrap gap-2 mt-3">
                {job.habilidades.map((habilidad, i) => (
                  <span key={i} className="bg-blue-300 text-white px-2 py-1 text-xs rounded">{habilidad}</span>
                ))}
              </div> */}
                {/*  <div className="text-right bottom-2 right-2 text-xs text-gray-500">
                  {formatDistanceToNow(new Date(job.publishedAt), { addSuffix: true, locale: es })}
                </div> */}
              </div>
            )) : <div><span className="text-sm">No hay avisos relacionados con estas categorias.</span></div>}
          </div>
        </div>
      </div>
      {/* <Footer /> */}
      <Toaster toastOptions={{
        duration: 3000,
        position: "bottom-center"
      }} />
    </>




  );
};

export default JobDetail;
