import { useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
/* import UserOne from '../../images/user/user-01.png'; */
import { API_LOCAL, API_URL } from "@/hooks/apis";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faListCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import { useChat } from '@/context/ctx';


const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useChat()
  const logout = async () => {
    try {
      const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });

      if (response.status === 200) {
        /* redirigir al inicio de sesión de keplan */
        /* setUser(null); */
        window.location.replace("https://auth.opawork.app")
        /* window.location.href = "http://localhost:5173/auth/signin"; */
        /*  window.location.href = "https://signin.unabuenauy.com"; */
      }


    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden sm:block text-right lg:block">
          <span className="block text-sm font-inter text-gray-800">
            {user ? user.email : ""}
          </span>
          <span className="block text-xs font-inter">{user?.typeAccount === "u" ? "Freelancer" : "Buscando talento"}</span>
        </span>
        <span className="sm:hidden text-right ">
          <span className="block text-sm font-medium text-gray-800">
            <FontAwesomeIcon icon={faEllipsis} />
          </span>
        </span>



        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark text-gray-500 dark:bg-boxdark z-1`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-3.5 dark:border-strokedark">
            <li>
              <Link
                to="/perfil"
                className="flex items-center gap-3.5 text-sm font-inter duration-300 ease-in-out hover:text-primary  lg:text-base"
              >
              <i className="hgi hgi-stroke hgi-user text-lg"></i>
                Mi perfil
              </Link>
            </li>

            <li>
              <Link
                to="/crearaviso"
                className="flex items-center gap-3.5 text-sm font-inter duration-300 ease-in-out hover:text-primary lg:text-base"
              >
               <i className="hgi hgi-stroke hgi-menu-02 text-lg"></i>
                Crear aviso
              </Link>
            </li>
          </ul>

          {user && (
            <button onClick={logout} className="flex items-center gap-3.5 px-6 py-4 text-sm font-inter duration-300 ease-in-out hover:text-primary lg:text-base">
              <i className="hgi hgi-stroke hgi-login-03 text-lg"></i>
              Cerrar sesión
            </button>
          )}
        </div>
      )}
      {/* <!-- Dropdown End --> */}
    </ClickOutside>
  );
};

export default DropdownUser;
