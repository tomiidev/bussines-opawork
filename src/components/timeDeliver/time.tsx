import React from "react";

type DateSelectorProps = {
  deliveryDate: string;
  setDeliveryDate: (date: string) => void;
  /*   formData: Record<string, any>; // Un objeto genérico con múltiples propiedades */
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

const DateSelector: React.FC<DateSelectorProps> = ({ deliveryDate, setDeliveryDate, setFormData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDeliveryDate(newDate); // Mantiene sincronizado el estado individual
    setFormData((prev: any) => ({ ...prev, deliveryDate: newDate })); // Actualiza el objeto sin perder otras props
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-semibold">Selecciona la fecha de entrega</p>
      <input
        type="date"
        name="deliveryDate"
        value={deliveryDate}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />
      {deliveryDate && (
        <div className="mt-4">
          <p className="text-sm">Fecha de entrega seleccionada: {deliveryDate}</p>
        </div>
      )}
    </div>
  );
};

export default DateSelector;
