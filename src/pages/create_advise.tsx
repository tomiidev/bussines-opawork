import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import UserProfileEditForm from './Form/data';
import { API_LOCAL, API_URL } from '@/hooks/apis';
import axios from 'axios';
import CreateAdviseForm from './Form/create_advise';
type User = {
  _id: string;
  id?: string;
  name: string;
  photo: string;
  email: string;
  phone: string,
  description: string,
  especialities: string[],
  time: string,
  subs: string[];
  languages: string[];
  socialNetworks?: { [key: string]: string }; // Redes sociales como objeto
};


const CreateAdvise = () => {
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
    <div className="flex  min-h-screen bg-gray-100">
      <div className="container mx-auto   max-w-7xl text-center">
   {/*    <Breadcrumb pageName="Crear aviso" number={0} />
 */}
      <div className="grid gap-8">
        <CreateAdviseForm user={user} />
     
      </div>
    </div>
    </div>
  );
};

export default CreateAdvise;
