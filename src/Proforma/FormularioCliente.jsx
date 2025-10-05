import React, { useEffect } from "react";

export default function FormularioCliente({ data = {}, onChange }) {
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const handleInput = (e) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  // 📅 Establece fecha actual por defecto al cargar el formulario
  useEffect(() => {
    if (!data.fecha) {
      const hoy = new Date().toISOString().slice(0, 10);
      onChange({ ...data, fecha: hoy });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="border-t pt-2 mb-4">
        <p className="font-semibold text-sm">
          Ingresa los datos del cliente que recibirá la proforma.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <input
          className={inputClass}
          name="nombre"
          placeholder="Nombre del cliente (obligatorio)"
          value={data.nombre || ""}
          onChange={handleInput}
        />

        <input
          className={inputClass}
          name="ruc"
          placeholder="DNI / RUC (opcional)"
          value={data.ruc || ""}
          onChange={handleInput}
        />

        <input
          className={inputClass}
          name="direccion"
          placeholder="Dirección del cliente (obligatorio)"
          value={data.direccion || ""}
          onChange={handleInput}
        />

        <div>
          <input
            className={inputClass}
            type="date"
            name="fecha"
            value={data.fecha || ""}
            onChange={handleInput}
          />
          <p className="mt-1 text-xs text-gray-500">
            Puedes modificar la fecha si es necesario.
          </p>
        </div>
      </div>
    </div>
  );
}
