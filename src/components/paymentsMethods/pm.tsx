import { useState, useCallback, useEffect } from "react";
import { BsBank, BsPaypal } from "react-icons/bs";
import { FaEllipsisV } from "react-icons/fa";

// Interfaz para Payment
interface Payment {
    method: string;
    value: string;
}

// Props para PaymentMethodMap
type PaymentProps = {
    selectedMethod: Payment;
    setSelectedMethod: React.Dispatch<React.SetStateAction<Payment>>;
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
};

// Props para PaymentOption
interface PaymentOptionProps {
    method: string;
    icon: JSX.Element;
    label: string;
    formData: any;
    value: string;
    openDropdown: string | null;
    selectedMethod: Payment | null;
    handleContinue: () => void;
    setSelectedMethod: React.Dispatch<React.SetStateAction<Payment>>;
    handleDelete: (method: string) => void;
    toggleDropdown: (method: string) => void;
}

const PaymentOption: React.FC<PaymentOptionProps> = ({
    method,
    icon,
    label,
    selectedMethod,
    formData,
    value,
    setSelectedMethod,
    handleContinue,
    handleDelete,
    openDropdown,
    toggleDropdown,
}) => {
    const paymentMethod = formData.paymentsMethods.find(
        (payment: { method: string }) => payment.method === method
    );

    return (
        <div
            className={`p-4 sm:min-w-56 sm:max-56 cursor-pointer border-2 rounded-lg transition-all ${selectedMethod?.method === method ? "border-blue-500" : "border-gray-300"}`}
            onClick={() => setSelectedMethod({ method, value })}
        >
            <div className="flex flex-col items-center gap-2 relative">
                {icon}
                <span className="font-roboto">{label}</span>

                {paymentMethod && paymentMethod.value && (
                    <span className="text-sm text-black">{paymentMethod.value}</span>
                )}
                {paymentMethod && <span className="text-green-500 text-sm">Vinculado</span>}

                {/* {paymentMethod && ( */}
                    <div className="absolute top-2 right-2">
                        <button onClick={(e) => { e.stopPropagation(); toggleDropdown(method); }} className="text-gray-500 hover:text-gray-700">
                            <FaEllipsisV className="w-3 h-3" />
                        </button>
                        {openDropdown === method && (
                            <div className="absolute right-0 mt-2 w-30 bg-white border border-gray-300 rounded shadow-lg m-3">
                                <button
                                    onClick={handleContinue}
                                    className="w-full text-left px-4 py-2 text-green-500 hover:bg-gray-200"
                                >
                                    Agregar
                                </button>
                                <button
                                    onClick={() => handleDelete(method)}
                                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
                                >
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
               {/*  )} */}
            </div>
        </div>
    );
};

const PaymentMethodMap: React.FC<PaymentProps> = ({ formData, setFormData, setSelectedMethod, selectedMethod }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (method: string) => {
        setOpenDropdown(prev => (prev === method ? null : method));
    };

    const handleContinue = useCallback(() => {
        if (selectedMethod) {
            setIsModalOpen(true);
        }
    }, [selectedMethod]);

    const handleAccept = useCallback(() => {
        if (selectedMethod && inputValue.trim()) {
            const updatedPayment = { method: selectedMethod.method, value: inputValue };

            setFormData((prev: any) => {
                const existingPaymentIndex = prev.paymentsMethods.findIndex(
                    (payment: { method: string }) => payment.method === selectedMethod.method
                );

                if (existingPaymentIndex !== -1) {
                    const updatedPayments = [...prev.paymentsMethods];
                    updatedPayments[existingPaymentIndex] = updatedPayment;
                    return { ...prev, paymentsMethods: updatedPayments };
                } else {
                    return {
                        ...prev,
                        paymentsMethods: [...prev.paymentsMethods, updatedPayment],
                    };
                }
            });

            setIsModalOpen(false);
            setOpenDropdown(null); // Cierra el dropdown al ingresar un dato
            setInputValue("");
        }
    }, [selectedMethod, inputValue, setFormData]);

    useEffect(() => {
        if (!isModalOpen) {
            setInputValue("");
        }
    }, [isModalOpen]);

    const handleDelete = (method: string) => {
        const updatedPayments = formData.paymentsMethods.filter(
            (payment: { method: string }) => payment.method !== method
        );

        setFormData({
            ...formData,
            paymentsMethods: updatedPayments,
        });
        setOpenDropdown(null); // Cierra el dropdown al eliminar
    };

    return (
        <div className="flex flex-col items-start gap-6 mt-5">
            <h2 className="text-xl font-roboto">
                Conecta métodos de pago para poder pagar por tus proyectos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <PaymentOption
                    method="bank"
                    handleContinue={handleContinue}
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    formData={formData}
                    value={inputValue}
                    icon={<BsBank className="w-12 h-12 text-blue-500" />}
                    label="Cuenta bancaria"
                    selectedMethod={selectedMethod}
                    setSelectedMethod={setSelectedMethod}
                    handleDelete={handleDelete}
                />
                <PaymentOption
                    method="paypal"
                    handleContinue={handleContinue}
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    formData={formData}
                    value={inputValue}
                    icon={<BsPaypal className="w-12 h-12 text-blue-500" />}
                    label="PayPal"
                    selectedMethod={selectedMethod}
                    setSelectedMethod={setSelectedMethod}
                    handleDelete={handleDelete}
                />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg text-black font-semibold mb-4">
                            Ingresa tu información
                        </h3>
                        <h3 className="text-sm mb-4">
                            Ingresa tu email o n° de cuenta según el método elegido.
                        </h3>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Ingresa tu dato"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethodMap;
