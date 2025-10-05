import React from "react";

export default function FormularioFooter({ data = {}, onChange }) {
  const handleInput = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const inputClass =
    "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium mb-1";

  return (
    <div>
      {/* 🟦 Línea superior + microtexto */}
      <div className="border-t pt-2 mb-4">
        <p className="font-semibold text-sm">
          Agrega observaciones adicionales y tus datos bancarios para facilitar el pago.
        </p>
      </div>

      {/* 📋 Observaciones y datos bancarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Observaciones</label>
          <textarea
            name="observaciones"
            value={data.observaciones || ""}
            onChange={handleInput}
            className={`${inputClass} min-h-[100px]`}
            placeholder="Ej: La entrega está sujeta a stock disponible..."
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Cuenta Bancaria</label>
            <input
              type="text"
              name="cuentaBancaria"
              value={data.cuentaBancaria || ""}
              onChange={handleInput}
              className={inputClass}
              placeholder="Ej: 123-4567890-0-11"
            />
          </div>

          <div>
            <label className={labelClass}>CCI</label>
            <input
              type="text"
              name="cci"
              value={data.cci || ""}
              onChange={handleInput}
              className={inputClass}
              placeholder="Ej: 00212300456789001199"
            />
          </div>

          <div>
            <label className={labelClass}>Titular</label>
            <input
              type="text"
              name="titular"
              value={data.titular || ""}
              onChange={handleInput}
              className={inputClass}
              placeholder="Ej: Proveedores del Oriente E.I.R.L."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
