import PriceRangeSelector from "@/components/priceSelector/price";
import { API_LOCAL } from "@/hooks/apis";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
interface PriceRange {
  min: number;
  max: number;
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
  socialNetworks?: { [key: string]: string }; // Redes sociales como objeto
};

interface SharedResourcesProps {
  user: User | null;
}

const UserProfileAppliedForm: React.FC<SharedResourcesProps> = ({ user }) => {
  console.log(JSON.stringify(user))
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });

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









  return (
    <div className="col-span-5 text-left">
      <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <div className="p-7">

          <div className="mb-5.5">
            <label className="block text-sm font-medium py-3">Nombre</label>
            <input
              className="w-full rounded border border-stroke py-3 px-4"
              type="text"
              name="name"
              value={formData.name}
              readOnly

            />
          </div>



          {/*    <div className="mb-5.5">
            <label className="block text-sm font-medium py-3">Email</label>
            <input
              className="w-full rounded border border-stroke py-3 px-4"
              type="email"
              name="email"
              value={formData.email}

              placeholder="Email"

            />
          </div> */}
          <div className="mb-5.5">
            <label className="block text-sm font-medium py-3">Idiomas</label>
            <div className="border border-stroke p-3 rounded-lg max-h-40 overflow-auto flex flex-wrap gap-2">
              {user?.languages?.map((lan) => {
                const isSelected = formData.languages.includes(lan);
                return (
                  <span
                    key={lan}

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
              {user?.especialities.map((especialidad) => {
                const isSelected = formData.especialities.includes(especialidad);
                return (
                  <span
                    key={especialidad}

                    className={`cursor-pointer px-3 py-1 rounded-full text-sm flex items-center transition-all 
                ${isSelected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
              `}
                  >
                    {especialidad}
                  </span>
                );
              })}
            </div>


          </div>
          <div className="mb-5.5">
            <label className="block text-sm font-medium py-3">Especialidades</label>
            <div className="border border-stroke p-3 rounded-lg max-h-40 overflow-auto flex flex-wrap gap-2">
              {user?.subs.map((subs) => {
                const isSelected = formData.subs.includes(subs);
                return (
                  <span
                    key={subs}

                    className={`cursor-pointer px-3 py-1 rounded-full text-sm flex items-center transition-all 
                ${isSelected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
              `}
                  >
                    {subs}
                  </span>
                );
              })}
            </div>


          </div>
          <div className="mb-5.5">
            <label className="block text-sm font-medium py-3">Disponibilidad</label>
            <input
              className="w-full rounded border border-stroke py-3 px-4"
              type="text"
              name="modality"
              readOnly
              value={formData.modality}


            />

          </div>
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
          <PriceRangeSelector priceRange={priceRange} setPriceRange={setPriceRange} formData={formData} setFormData={setFormData} />

          <div className="flex justify-end">
            <button
              className="bg-primary text-white py-2 px-6 rounded hover:bg-opacity-90"
              type="submit"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfileAppliedForm;
