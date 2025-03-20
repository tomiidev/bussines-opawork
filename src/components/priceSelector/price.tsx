import React from "react";

type PriceRange = {
  min: number;
  max: number;
};

type PriceRangeSelectorProps = {
  priceRange: PriceRange;
  setPriceRange: React.Dispatch<React.SetStateAction<PriceRange>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

const PriceRangeSelector: React.FC<PriceRangeSelectorProps> = ({ priceRange, setPriceRange, formData, setFormData }) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = parseInt(value, 10);

    setPriceRange((prevRange) => {
      const updatedRange = { ...prevRange, [name]: newValue };
      if (name === "min" && newValue > prevRange.max) {
        updatedRange.max = newValue;
      } else if (name === "max" && newValue < prevRange.min) {
        updatedRange.min = newValue;
      }
      setFormData((prev: any) => ({ ...prev, priceRange: updatedRange }));
      return updatedRange;
    });
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
          value={formData.priceRange.min}
          onChange={handlePriceChange}
          className="w-full"
        />
        <input
          type="number"
          name="min"
          value={formData.priceRange.min}
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
          value={formData.priceRange.max}
          onChange={handlePriceChange}
          className="w-full"
        />
        <input
          type="number"
          name="max"
          value={formData.priceRange.max}
          onChange={handlePriceChange}
          min="0"
          max="1000"
          step="10"
          className="w-16 p-1 border rounded"
        />
      </div>
      <div className="mt-4">
        <p className="text-sm">Rango de precios seleccionado: ${formData.priceRange.min} - ${formData.priceRange.max}</p>
      </div>
    </div>
  );
};

export default PriceRangeSelector;
