import PaymentMethodMap from "@/components/paymentsMethods/pm";
import { API_LOCAL } from "@/hooks/apis";
import React, { useEffect, useState } from "react";
interface PriceRange {
  min: number;
  max: number;
}
interface Payment {
  method: string,
  value: string,
}

type User = {
  _id: string;
  email: string;
  name: string;
  languages: string[];
  phone: string;
  description: string;
  photo: string;
  especialities: string[]; // Agrega la especialidad al formulario de edición de usuario
  modality: string; // Agrega la especialidad al formulario de edición de usuario
  subs: string[];
  department?: string;
  neighborhood?: string;
  priceRange?: PriceRange;
  paymentsMethods: Payment[]
  socialNetworks?: { [key: string]: string }; // Redes sociales como objeto
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



const UserProfileEditForm: React.FC<SharedResourcesProps> = ({ user }) => {
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });
  const [selectedMethod, setSelectedMethod] = useState<Payment>({ method: "", value: "" });
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    description: user?.description || "",
    especialities: user?.especialities || [],
    photo: user?.photo,
    modality: user?.modality || "",
    subs: user?.subs || [],
    department: user?.department || "",
    languages: user?.languages || [],
    neighborhood: user?.neighborhood || "",
    paymentsMethods: user?.paymentsMethods || [{ method: "" }],
    priceRange: user?.priceRange || { min: 0, max: 0 },
    socialNetworks: user?.socialNetworks || {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      youtube: "",
      tiktok: "",
      github: "",
    }, // Inicializa redes sociales si están presentes
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "", // Asegura que el email se setea
        description: user.description || "",
        photo: user.photo,
        especialities: user.especialities || [],
        languages: user?.languages || [],
        modality: user?.modality || "",
        subs: user.subs || [],
        paymentsMethods: user?.paymentsMethods || [],
        department: user.department || "",
        neighborhood: user.neighborhood || "",
        priceRange: user?.priceRange || { min: 0, max: 0 },
        socialNetworks: user.socialNetworks || {
          facebook: "",
          instagram: "",
          linkedin: "",
          twitter: "",
          youtube: "",
          tiktok: "",
          github: "",
        }, // Inicializa redes sociales si están presentes
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
  console.log(formData)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_LOCAL}/user-information`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        mode: "cors",
        credentials: "include", // Enviar cookies HTTP-only automáticamente
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      alert("Perfil actualizado con éxito");
      window.location.reload();
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
  const handleSocialNetworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialNetworks: {
        ...prev.socialNetworks,
        [name]: value,
      },
    }));
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
  const toogleLeng = (lan: string) => {
    // Obtener el array de especialidades del estado actual
    const languages = formData.languages;

    // Verificar si la especialidad ya está seleccionada
    const isSelected = languages.includes(lan);
    setFormData({
      ...formData,
      languages: isSelected
        ? languages.filter((item) => item !== lan) // Elimina si ya está
        : [...languages, lan], // Agrega si no está
    });
  };
  const toggleEspecialidad = (especialidad: string) => {
    // Obtener el array de especialidades del estado actual
    const especialities = formData.especialities;

    // Verificar si la especialidad ya está seleccionada
    const isSelected = especialities.includes(especialidad);
    if (!isSelected && especialities.length === 3) {
      // Mostrar un mensaje si ya hay 3 especialidades seleccionadas
      alert("Puedes seleccionar hasta 3 especialidades.");
      return; // No permitir agregar más si ya hay 3 seleccionadas
    }
    setFormData({
      ...formData,
      especialities: isSelected
        ? especialities.filter((item) => item !== especialidad) // Elimina si ya está
        : [...especialities, especialidad], // Agrega si no está
    });
  };

  return (
    <div className="col-span-5 text-left">
      <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Nombre</label>
              <input
                className="w-full rounded border border-stroke py-3 px-4"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
              />
            </div>

            <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Teléfono</label>
              <input
                className="w-full rounded border border-stroke py-3 px-4"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono"
              />
            </div>

            <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Email</label>
              <input
                className="w-full rounded border border-stroke py-3 px-4"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"

              />
            </div>
            <div className="mb-5.5">
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
            {/* <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Especialidades</label>
              <div className="border border-stroke p-3 rounded-lg max-h-40 overflow-auto flex flex-wrap gap-2">
                {generalServices.map((especialidad) => {
                  const isSelected = formData.especialities.includes(especialidad);
                  return (
                    <span
                      key={especialidad}
                      onClick={() => toggleEspecialidad(especialidad)}
                      className={`cursor-pointer px-3 py-1 rounded-full text-sm flex items-center transition-all 
                ${isSelected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
              `}
                    >
                      {especialidad}
                    </span>
                  );
                })}
              </div>
     

            </div> */}
            {/*  <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Disponibilidad</label>
              <select
                name="modality"
                value={formData.modality}
                onChange={handleChange}
                className="w-full rounded border border-stroke py-3 px-4"
              >
                <option value="">Selecciona una modalidad</option>
                <option value="online">Tiempo completo</option>
                <option value="presencial">Medio tiempo</option>
                <option value="ambas">Fines de semana</option>

              </select>

            </div> */}
            {/* <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Modalidad de trabajo</label>
              <select
                name="modality"
                value={formData.modality}
                onChange={handleChange}
                className="w-full rounded border border-stroke py-3 px-4"
              >
                <option value="">Selecciona una modalidad</option>
                <option value="online">Remoto</option>
                <option value="presencial">Presencial</option>
                <option value="ambas">Ambas</option>

              </select>

            </div> */}
            <div className="mb-5.5">
              {/* <label className="block text-sm font-medium py-3">Sub especialidades</label>
              <input
                type="text"
                placeholder="Escribí lo que hagas mejor y presioná Enter"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                name="subs"
                className="w-full rounded border border-stroke py-3 px-4"
              />
              <div className="mt-3 flex flex-wrap gap-2 py-3">
                {formData.subs.map((type) => (
                  <span
                    key={type}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => removeTherapyType(type)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div> */}
              {/*               {
                (formData.modality === "online" || formData.modality === "ambas") &&
                <>
                  <div className="mb-5.5">
                    <label className="block text-sm font-medium py-3">Departamento</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full rounded border border-stroke py-3 px-4"
                    >
                      <option value="">Selecciona un departamento</option>
                      {Object.keys(departments).map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-5.5">
                    <label className="block text-sm font-medium py-3">Barrio</label>
                    <select
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      className="w-full rounded border border-stroke py-3 px-4"
                      disabled={!formData.department}
                    >
                      <option value="">Selecciona un barrio</option>
                      {formData.department && (departments[formData.department as keyof typeof departments])?.map((barrio) => (
                        <option key={barrio} value={barrio}>{barrio}</option>
                      ))}
                    </select>
                  </div>
                </>
              } */}
            </div>
            <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Descripción</label>
              <textarea
                className="w-full rounded border border-stroke py-3 px-4"
                name="description"
                rows={4}
                minLength={50}
                maxLength={300}
                value={formData.description}
                onChange={handleChange}
                placeholder="Escribe tu bio aquí"
              ></textarea>
            </div>
            <div className="mb-5.5">
              <label className="block text-sm font-medium py-3">Redes Sociales</label>

              {Object.keys(formData.socialNetworks).map((social) => (
                social !== "newNetwork" && (
                  <div key={social} className="mb-3">
                    {/*  <label className="block text-sm">{social.charAt(0).toUpperCase() + social.slice(1)}</label> */}
                    <input
                      className="w-full rounded border border-stroke py-3 px-4"
                      type="text"
                      name={social}
                      value={formData.socialNetworks[social]}
                      onChange={handleSocialNetworkChange}
                      placeholder={`Enlace a ${social}`}
                    />
                    {/*  <button
                      type="button"
                      onClick={() => handleRemoveSocialNetwork(social)}
                      className="text-red-500 mt-2"
                    >
                      Eliminar
                    </button> */}
                  </div>
                )
              ))}


            </div>
            {/*  <PriceRangeSelector priceRange={priceRange} setPriceRange={setPriceRange} formData={formData} setFormData={setFormData}/> */}

            <div className="flex justify-end">
              <button
                className="bg-primary text-white py-2 px-6 rounded hover:bg-opacity-90"
                type="submit"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <PaymentMethodMap formData={formData} selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} setFormData={setFormData} />
    </div>
  );
};

export default UserProfileEditForm;
