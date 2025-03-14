import React, { useState } from "react";

const PriceRangeSelector = () => {
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });

  // Función para manejar el cambio en el rango
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = parseInt(value);

    // Validar que el valor máximo no sea menor que el mínimo
    if (name === "min" && newValue > priceRange.max) {
      setPriceRange((prevRange) => ({
        ...prevRange,
        min: newValue,
        max: newValue, // Si el mínimo es mayor que el máximo, actualizamos el máximo
      }));
    } else if (name === "max" && newValue < priceRange.min) {
      setPriceRange((prevRange) => ({
        ...prevRange,
        max: newValue,
        min: newValue, // Si el máximo es menor que el mínimo, actualizamos el mínimo
      }));
    } else {
      setPriceRange((prevRange) => ({
        ...prevRange,
        [name]: newValue, // Si no hay conflicto, solo actualizamos el valor correspondiente
      }));
    }
  };
  return (
    <div className="p-4">
      <p className="mb-4 font-semibold">Selecciona el rango de precios</p>
      
      <div className="flex items-center gap-2">
        <label htmlFor="minPrice" className="text-sm font-medium">Precio Mínimo:</label>
        <input
          id="minPrice"
          type="range"
          name="min"
          min="0"
          max="1000"
          step="10"
          value={priceRange.min}
          onChange={handlePriceChange}
          className="w-full"
        />
        <input
          type="number"
          name="min"
          value={priceRange.min}
          onChange={handlePriceChange}
          min="0"
          max="1000"
          step="10"
          className="w-16 p-1 border rounded"
        />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <label htmlFor="maxPrice" className="text-sm font-medium">Precio Máximo:</label>
        <input
          id="maxPrice"
          type="range"
          name="max"
          min="0"
          max="1000"
          step="10"
          value={priceRange.max}
          onChange={handlePriceChange}
          className="w-full"
        />
        <input
          type="number"
          name="max"
          value={priceRange.max}
          onChange={handlePriceChange}
          min="0"
          max="1000"
          step="10"
          className="w-16 p-1 border rounded"
        />
      </div>

      {/* Mostrar el rango seleccionado */}
      <div className="mt-4">
        <p className="text-sm">
          Rango de precios seleccionado: ${priceRange.min} - ${priceRange.max}
        </p>
      </div>
    </div>
  );
};

export default PriceRangeSelector;
