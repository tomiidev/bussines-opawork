import { useNavigate } from "react-router-dom";

const ProfileCard = () => {
    const nv = useNavigate()
    const navigatePerfil = () => {
        nv("/perfil")
    }
    return (
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-semibold">Armá tu perfil y recibí ofertas personalizadas</h2>
            <p className="mt-2 text-sm opacity-90">Completá tu información para que los negocios te encuentren más rápido.</p>
            <button onClick={navigatePerfil} className="mt-4 bg-white text-green-600 font-medium py-2 px-4 rounded-full hover:bg-opacity-90 transition">
                Completar perfil
            </button>
        </div>
    );
};

export default ProfileCard;
