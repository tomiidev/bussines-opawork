import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import UserProfileEditForm from './Form/data';
import { API_LOCAL, API_URL } from '@/hooks/apis';
import axios from 'axios';
type User = {
  _id: string;
  id?: string;
  name: string;
  photo: string;
  email: string;
  phone: string,
  description: string,
  especialities: string[],
  modality: string,
  subs: string[];
  languages: string[];
  socialNetworks?: { [key: string]: string }; // Redes sociales como objeto
};


const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
  useEffect(() => {


    const getDataInformation = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-user-data`, { withCredentials: true });

        if (response.status === 200) {
          const userData = response.data.data;
          console.log(userData)
          setUser(userData);
        } else {
          setUser(null);

        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setUser(null);

      }
    }
    getDataInformation();

  }, [])
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setErrorMessage(null); // Clear error if valid
      const img = new Image();
      const reader = new FileReader();

      reader.onloadend = () => {
        img.src = reader.result as string;

        img.onload = () => {
          if (img.width <= 400 && img.height <= 400) {
            setImagePreview(reader.result as string);
            setErrorMessage(null); // Clear error if valid
          } else {
            setErrorMessage('La imagen no puede ser mayor a 400x400 píxeles');
            setImagePreview(null); // Reset preview if invalid
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement; // Cast to HTMLFormElement
    const fileInput = form.elements.namedItem('image') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      alert('No se seleccionó ninguna imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_LOCAL}/upload-photo-by-user`, {
        method: 'POST',
        credentials: "include",
        mode: "cors",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Imagen subida correctamente', result);
        // Aquí puedes manejar el resultado de la respuesta del servidor
      } else {
        throw new Error('Hubo un problema al subir la imagen.');
      }
    } catch (error) {
      console.error(error);
      alert('Error al subir la imagen');
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex  min-h-screen">
      <div className="container mx-auto   max-w-7xl text-center">
      <Breadcrumb pageName="Información personal" number={0} />

      <div className="grid gap-8">
        <UserProfileEditForm user={user} />
        <div className="col-span-5">
          <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Tu foto (Opcional - recomendado)</h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="User"
                        className="w-full h-full object-cover border border-1 border-black rounded-full"
                      />
                    ) : (

                      <img src={`https://contygo.s3.us-east-2.amazonaws.com/${user && user._id}/foto/${user && user.photo}`} alt="User" className="w-full h-full object-cover border border-1 border-black rounded-full" />
                    )}
                  </div>

                  <div>
                    <span className="mb-1.5 text-black dark:text-white">Edita tu foto</span>
                  </div>
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <input
                    type="file"
                    accept="image/*"
                    name="image"  // Asegúrate de agregar el nombre al input
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    onChange={handleImageChange}
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                          fill="#3C50E0"
                        />
                      </svg>
                    </span>
                    <p>
                      <span className="text-primary">Click para subir tu foto de perfil</span>
                    </p>
                    <p className="mt-1.5">SVG, PNG, JPG o GIF</p>
                    <p>(max, 400 X 400px)</p>
                  </div>
                </div>

                <div className="flex justify-end gap-4.5">
                  {/*  */}
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
        </div>
      </div>
    </div>
    </div>
  );
};

export default Settings;
