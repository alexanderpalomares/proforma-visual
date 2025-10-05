import React, { useRef } from "react";

export default function FormularioEmpresa({ data = {}, onChange }) {
  const fileRef = useRef(null);
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const handleInput = (e) =>
    onChange({ ...data, [e.target.name]: e.target.value });

  const onLogoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...data, logo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const limpiarLogo = () => {
    if (fileRef.current) fileRef.current.value = "";
    onChange({ ...data, logo: "" });
  };

  return (
    <div>
      <div className="border-t pt-2 mb-4">
        <p className="font-semibold text-sm">
          Completa la información de tu empresa que aparecerá en la proforma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className={inputClass}
          name="nombre"
          placeholder="Razón social (obligatorio)"
          value={data.nombre || ""}
          onChange={handleInput}
        />
        <input
          className={inputClass}
          name="ruc"
          placeholder="RUC (opcional)"
          value={data.ruc || ""}
          onChange={(e) =>
            onChange({
              ...data,
              ruc: e.target.value.replace(/\D/g, "").slice(0, 11),
            })
          }
        />
        <input
          className={inputClass}
          name="direccion"
          placeholder="Dirección (obligatorio)"
          value={data.direccion || ""}
          onChange={handleInput}
        />
        <input
          className={inputClass}
          name="telefono"
          placeholder="Teléfono (obligatorio)"
          value={data.telefono || ""}
          onChange={(e) =>
            onChange({
              ...data,
              telefono: e.target.value.replace(/[^\d+]/g, ""),
            })
          }
        />
        <input
          className={inputClass}
          name="correo"
          placeholder="Correo (opcional)"
          value={data.correo || ""}
          onChange={handleInput}
        />
        <input
          className={inputClass}
          name="web"
          placeholder="Web (opcional)"
          value={data.web || ""}
          onChange={handleInput}
        />

        <div className="md:col-span-2">
          <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-0"
              onChange={onLogoFile}
            />
            {data.logo ? (
              <>
                <img
                  src={data.logo}
                  alt="Logo"
                  className="w-full h-full object-contain z-10 pointer-events-none"
                />
                <button
                  type="button"
                  aria-label="Quitar logo"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    limpiarLogo();
                  }}
                  className="absolute top-1 right-1 z-20 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                >
                  ✕
                </button>
              </>
            ) : (
              <span className="text-gray-400 text-xs text-center px-2 z-10 pointer-events-none">
                Selecciona tu logo (opcional)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
