import React from "react";

export default function FormularioTipoDocumento({ data = {}, onChange }) {
  const tipos = ["PROFORMA", "NOTA DE PEDIDO", "NOTA DE VENTA"];

  const handleSelect = (tipo) => {
    onChange({ ...data, tipo });
  };

  return (
    <div>
      {/* 🟦 Línea superior + microtexto */}
      <div className="border-t pt-2 mb-4">
        <p className="font-semibold text-sm">Elige el tipo de documento que deseas generar.</p>
      </div>

      {/* 🟢 Botones de selección */}
      <div className="flex gap-2">
        {tipos.map((tipo) => {
          const active = data.tipo === tipo;
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => handleSelect(tipo)}
              className={`flex-1 px-4 py-2 rounded-lg transition border ${
                active
                  ? "bg-blue-600 text-white font-bold border-blue-600"
                  : "bg-gray-50 text-gray-800 font-medium border-gray-300 hover:bg-gray-100"
              }`}
            >
              {tipo}
            </button>
          );
        })}
      </div>
    </div>
  );
}
