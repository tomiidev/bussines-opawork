import { faMoneyBill1Wave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

// Definir las props del componente
interface TotalGanadoProps {
    totalAmount: number; // El monto total ganado
    onWithdraw: () => void; // Función para manejar el retiro
}

// Componente para mostrar el mensaje sobre el plazo de los retiros
const PlazoRetiros: React.FC = () => {
    return (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-sm  mt-4 mb-5">
            <p className="text-sm font-medium">
                Los retiros se realizan en un plazo de hasta 21 días hábiles. Por favor, tene en cuenta que
                puede variar según el método de pago y otros factores. Agradecemos tu paciencia.
            </p>
        </div>
    );
};



const TotalGanado: React.FC<TotalGanadoProps> = ({ totalAmount, onWithdraw }) => {
    return (
        <>
            <div className="flex flex-col sm:flex-row items-center  justify-between p-4 bg-white text-white rounded-sm shadow mb-5">
                {/* En dispositivos móviles: Total ganado y monto en la misma fila */}
                <div className="flex items-center text-black  sm:flex-row items-center justify-between sm:space-x-4 w-full mb-4 sm:mb-0">
                    {/* Icono y texto de Total ganado */}
                    <div className="flex items-center space-x-2  sm:mb-0">
                        <FontAwesomeIcon icon={faMoneyBill1Wave} className="text-xl" />
                        <span className="text-sm font-medium">Total ganado</span>
                    </div>

                    {/* Monto, alineado a la derecha en vista escritorio */}
                    <div className="flex items-center space-x-2 sm:ml-auto  sm:mt-0">
                        <span className="text-sm font-semibold">${totalAmount.toFixed(2)}</span>
                        <span className="text-sm">USD</span>
                    </div>
                </div>

                {/* Separación entre el monto y el botón en vista móvil y escritorio */}
                <div className="w-full  sm:mt-0 sm:w-1/5 sm:ml-5">
                    <button
                        onClick={onWithdraw}
                        className="w-full sm:w-full text-xs  px-5  py-2 border border-white text-white shadow-lg bg-green-500 rounded-full  hover:bg-green-700  transition-all"
                    >
                        Solicitar retiro
                    </button>
                </div>
            </div>
            <PlazoRetiros />
        </>
    );
};

export default TotalGanado;
