import React, { useState } from "react";

const DateSelector = () => {
  const [deliveryDate, setDeliveryDate] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryDate(e.target.value);
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-semibold">Selecciona la fecha de entrega</p>

      <input
        type="date"
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
