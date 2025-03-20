import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900  text-white py-10 mt-10 px-5">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div>
            <h2 className="text-xl font-bold">Opawork</h2>
            <p className="text-gray-400 mt-2 text-xs sm:text-sm">La mejor plataforma para conectar freelancers con clientes en todo el mundo.</p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-sm sm:text-lg font-semibold mb-3">Enlaces rápidos</h3>
            <ul className="text-gray-400 space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-white">Inicio</a></li>
              <li><a href="#" className="hover:text-white">Explorar Trabajos</a></li>
              <li><a href="#" className="hover:text-white">Publicar un Proyecto</a></li>
              <li><a href="#" className="hover:text-white">Contacto</a></li>
            </ul>
          </div>

          {/* Recursos */}
        {/*   <div>
            <h3 className="text-lg font-semibold mb-3">Recursos</h3>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-white">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-white">Privacidad</a></li>
            </ul>
          </div> */}

          {/* Redes sociales */}
          <div>
            <h3 className="text-sm sm:text-lg font-semibold mb-3">Seguínos</h3>
            <div className="flex space-x-4 text-gray-400">
              <a href="#" className="hover:text-white">🌐</a>
              <a href="#" className="hover:text-white">🐦</a>
              <a href="#" className="hover:text-white">📘</a>
              <a href="#" className="hover:text-white">📸</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-4">
          &copy; {new Date().getFullYear()} Opawork. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
