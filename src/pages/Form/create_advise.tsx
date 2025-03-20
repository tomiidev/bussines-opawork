import PriceRangeSelector from "@/components/priceSelector/price";
import DateSelector from "@/components/timeDeliver/time";
import { API_LOCAL } from "@/hooks/apis";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { generalServices } from "@/services";
import { useNavigate } from "react-router-dom";
interface PriceRange {
  min: number;
  max: number;
}
interface DeliveryDate {
  deliveryDate: string
}

type User = {
  _id: string;
  name: string;
  description: string;
  languages: string[];
  especialities: string[]; // Agrega la especialidad al formulario de edición de usuario
  subs: string[];
  time: string,
  endDateProject: DeliveryDate
  fixedPrice: string
  priceRange?: PriceRange;

};

interface SharedResourcesProps {
  user: User | null;
}


const languages = [
  "Español",
  "Inglés",
  "Portugués",
  "Francés",
  "Alemán",
  "Italiano",
  "Chino Mandarín",
  "Japonés",
  "Ruso",
  "Árabe",
  "Coreano",
  "Hindi",
  "Bengalí",
  "Turco",
  "Vietnamita",
  "Polaco",
  "Neerlandés",
  "Sueco",
  "Danés",
  "Griego",
  "Checo",
  "Tailandés",
  "Rumano",
  "Húngaro",
  "Indonesio",
  "Hebreo",
  "Noruego",
  "Finlandés",
  "Malayo",
  "Ucraniano",
  "Hebreo",
  "Tagalo",
  "Gujarati",
  "Kannada",
  "Tamil",
  "Marathi",
  "Punjabi",
  "Urdu",
  "Swahili",
  "Haitiano Creole"
];



const CreateAdviseForm: React.FC<SharedResourcesProps> = ({ user }) => {
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });
  const [deliveryDate, setDeliveryDate] = useState<string>("")
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    languages: user?.languages || [],
    description: user?.description || "",
    especialities: user?.especialities || [],
    time: user?.time || "",
    endDateProject: user?.endDateProject || { deliveryDate: "" },
    subs: user?.subs || [],
    fixedPrice: user?.fixedPrice || "no",
    priceRange: user?.priceRange || { min: 0, max: 0 },// Inicializa redes sociales si están presentes
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        // Asegura que el email se setea
        languages: user?.languages || [],
        description: user.description || "",
        especialities: user.especialities || [],
        time: user?.time || "",
        subs: user.subs || [],
        endDateProject: user?.endDateProject || { deliveryDate: "" },
        fixedPrice: user?.fixedPrice || "no",
        priceRange: user?.priceRange || { min: 0, max: 0 } // Inicializa redes sociales si están presentes
      });
    }
  }, [user]); // Ejecuta el efecto cuando `user` cambia

  /*   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value,  });
      
    }; */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" ? { neighborhood: "" } : {}),
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_LOCAL}/advise-information`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        mode: "cors",
        credentials: "include", // Enviar cookies HTTP-only automáticamente
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      toast.success("Aviso publicado con éxito");
      navigate(-1)
    } catch (error) {
      console.error(error);
      alert("Hubo un error, intenta nuevamente");
    } finally {
      setLoading(false);
    }
  };

  const removeTherapyType = (type: string) => {
    const updatedTherapyTypes = formData.subs.filter(t => t !== type);
    setFormData({
      ...formData,
      subs: updatedTherapyTypes.length > 0 ? updatedTherapyTypes : [],
    });
  };



  const [inputValue, setInputValue] = useState<string>("");
  const [espeValue, setEspeValue] = useState<string>("");
  const [therapyTypes, setTherapyTypes] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault(); // Evita el envío del formulario

      if (!formData.subs.includes(inputValue.trim())) {
        setFormData((prevData) => ({
          ...prevData,
          subs: [...prevData.subs, inputValue.trim()],
        }));
      }

      setInputValue(""); // Limpiar el input después de agregar
    }
  };
  const toogleLeng = (lang: string) => {
    // Obtener el array de especialidades del estado actual
    const languages = formData.languages;

    // Verificar si la especialidad ya está seleccionada
    const isSelected = languages.includes(lang);
    setFormData({
      ...formData,
      languages: isSelected
        ? languages.filter((item) => item !== lang) // Elimina si ya está
        : [...languages, lang], // Agrega si no está
    });
  };
  const toggleEspecialidad = (especialidad: string) => {
    setFormData((prevFormData) => {
      const especialities = prevFormData.especialities;
      const isSelected = especialities.includes(especialidad);

      if (!isSelected && especialities.length === 2) {
        alert(`Solo puedes seleccionar hasta ${2} especialidades.`);
        return prevFormData; // Retorna el estado anterior sin cambios
      }

      return {
        ...prevFormData,
        especialities: isSelected
          ? especialities.filter((item) => item !== especialidad)
          : [...especialities, especialidad],
      };
    });
  };
  const toggleSubs = (sub: string) => {
    setFormData((prevFormData) => {
      const subs = prevFormData.subs;
      const isSelected = subs.includes(sub);

      if (!isSelected && subs.length >= 10) {
        // Aquí podrías usar un toast en lugar de alert para mejor UX
        toast.error(`No podes elegír más subespecialidades.`);
        return prevFormData; // Retorna el estado anterior sin cambios
      }

      return {
        ...prevFormData,
        subs: isSelected ? subs.filter((item) => item !== sub) : [...subs, sub],
      };
    });
  };

  return (
    <div className="col-span-5 text-left">
      <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="">
              <label className="block text-sm font-medium py-3">Título</label>
              <input
                className="w-full rounded border border-stroke py-3 px-4"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Título"
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium py-3">¿Qué necesitas?</label>
              <textarea
                className="w-full rounded border border-stroke py-3 px-4"
                name="description"
                rows={4}
                minLength={50}
                maxLength={300}
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción del proyecto"
              ></textarea>
            </div>

            <div className="">
              <label className="block text-sm font-medium py-3">Idiomas</label>
              <div className="border border-stroke p-3 rounded-lg max-h-40 overflow-auto flex flex-wrap gap-2">
                {languages.map((lan) => {
                  const isSelected = formData.languages.includes(lan);
                  return (
                    <span
                      key={lan}
                      onClick={() => toogleLeng(lan)}
                      className={`cursor-pointer px-3 py-1 rounded-full text-sm flex items-center transition-all 
                ${isSelected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
              `}
                    >
                      {lan}
                    </span>
                  );
                })}
              </div>


            </div>
            <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Especialidades</label>
              <div className="border border-stroke p-3 rounded-lg max-h-40 overflow-auto flex flex-wrap gap-2">
                {Object.keys(generalServices).map((categoria) => {
                  const isSelected = formData.especialities.includes(categoria);
                  return (
                    <span
                      key={categoria}
                      onClick={() => toggleEspecialidad(categoria)}
                      className={`cursor-pointer px-3 py-1 rounded-full text-sm flex items-center transition-all 
          ${isSelected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    >
                      {categoria}
                    </span>
                  );
                })}
              </div>
            </div>
            {formData.especialities.length > 0 && (
              <div className="my-5.5">
                <h3>Subespecialidades</h3>
                {formData.especialities.map((categoria: string) => {
                  const subespecialidades = generalServices[categoria];
                  return (
                    <div key={categoria} className="my-5">

                      <div className="border border-stroke p-3 rounded-lg max-h-40 overflow-auto flex flex-wrap gap-2">
                        {/* Mapear las subespecialidades */}
                        {subespecialidades.map((sub: string) => {
                          const isSubSelected = formData.subs.includes(sub);
                          return (
                            <span
                              key={sub}
                              onClick={() => toggleSubs(sub)}
                              className={`cursor-pointer px-3 py-1 rounded-full text-sm flex items-center transition-all ${isSubSelected ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                              {sub}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Disponibilidad de tiempo</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full rounded border border-stroke py-3 px-4"
              >
                <option value="">Selecciona una modalidad</option>
                <option value="Tiempo completo">Tiempo completo</option>
                <option value="Medio tiempo">Medio tiempo</option>
                <option value="Fines de semana">Fines de semana</option>

              </select>

            </div>
            <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Precio negociable</label>
              <select
                name="fixedPrice"
                value={formData.fixedPrice}
                onChange={handleChange}
                className="w-full rounded border border-stroke py-3 px-4"
              >
                <option value="">Selecciona</option>
                <option value="si">Sí</option>
                <option value="no">No</option>


              </select>

            </div>
            <div className="mb-5.5">
              <DateSelector deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate} formData={formData} setFormData={setFormData} />
              <p className="mb-4 text-gray-500">Para inidicar un presupuesto exacto se debe situar en el mismo valor ambos inputs.</p>
              <PriceRangeSelector priceRange={priceRange} setPriceRange={setPriceRange} formData={formData} setFormData={setFormData} />
            </div>


            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-opacity-90"
                type="submit"
                disabled={loading}
              >
                {loading ? "Publicando..." : "Publicar aviso"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster toastOptions={{
        duration: 3000,
        position: "bottom-center"
      }} />
    </div>
  );
};

export default CreateAdviseForm;
