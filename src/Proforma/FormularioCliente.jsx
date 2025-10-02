import React from "react";

export default function FormularioCliente({ data = {}, onChange }) {
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const handleInput = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <input
        className={inputClass}
        name="nombre"
        placeholder="Ramón Manrique"
        value={data.nombre || ""}
        onChange={handleInput}
      />
      <input
        className={inputClass}
        name="ruc"
        placeholder="46420566"
        value={data.ruc || ""}
        onChange={handleInput}
      />
      <input
        className={inputClass}
        name="direccion"
        placeholder="Jr. Alfonso Ugarte 392, Tarapoto"
        value={data.direccion || ""}
        onChange={handleInput}
      />
      <input
        className={inputClass}
        type="date"
        name="fecha"
        value={data.fecha || ""}
        onChange={handleInput}
      />
    </div>
  );
}
