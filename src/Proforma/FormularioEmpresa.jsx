import React, { useRef } from "react";

export default function FormularioEmpresa({ empresa, setEmpresa }) {
  const fileRef = useRef(null);
  const input =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const onChange = (e) =>
    setEmpresa((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Permite subir archivo y guarda DataURL en empresa.logo
  const onLogoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEmpresa((prev) => ({ ...prev, logo: reader.result })); // DataURL
    };
    reader.readAsDataURL(file);
  };

  const limpiarLogo = () => {
    if (fileRef.current) fileRef.current.value = "";
    setEmpresa((prev) => ({ ...prev, logo: "" }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        className={input}
        name="nombre"
        placeholder="Ferretería Kike"
        value={empresa.nombre || ""}
        onChange={onChange}
      />
      <input
        className={input}
        name="ruc"
        placeholder="20601648391"
        value={empresa.ruc || ""}
        onChange={(e) =>
          // solo números, máx 11
          setEmpresa((p) => ({
            ...p,
            ruc: e.target.value.replace(/\D/g, "").slice(0, 11),
          }))
        }
      />
      <input
        className={input}
        name="direccion"
        placeholder="Jr. Alfonso Ugarte 392, Tarapoto"
        value={empresa.direccion || ""}
        onChange={onChange}
      />
      <input
        className={input}
        name="telefono"
        placeholder="987916570"
        value={empresa.telefono || ""}
        onChange={(e) =>
          // deja + y dígitos
          setEmpresa((p) => ({
            ...p,
            telefono: e.target.value.replace(/[^\d+]/g, ""),
          }))
        }
      />
      <input
        className={input}
        name="correo"
        placeholder="ferreteriakike@gmail.com"
        value={empresa.correo || ""}
        onChange={onChange}
      />
      <input
        className={input}
        name="web"
        placeholder="www.ferreteriakike.com"
        value={empresa.web || ""}
        onChange={onChange}
      />

      {/* Subida de logo en cuadro cuadrado */}
      <div className="md:col-span-2">
        <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer">
          {empresa.logo ? (
            <>
              <img
                src={empresa.logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
              {/* Botón X arriba a la derecha */}
              <button
                type="button"
                onClick={limpiarLogo}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
              >
                ✕
              </button>
            </>
          ) : (
            <span className="text-gray-400 text-xs text-center px-2">
              Selecciona tu logo
            </span>
          )}

          {/* Input invisible que cubre todo el cuadro */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={onLogoFile}
          />
        </div>
      </div>
    </div>
  );
}
