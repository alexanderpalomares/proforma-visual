import React, { useRef } from "react";

export default function FormularioEmpresa({ empresa, setEmpresa }) {
  const fileRef = useRef(null);
  const input =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const onChange = (e) =>
    setEmpresa({ [e.target.name]: e.target.value }); // ✅ pasa solo el campo

  // Permite subir archivo y guarda DataURL en empresa.logo
  const onLogoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEmpresa({ logo: reader.result }); // ✅ solo actualiza logo
    };
    reader.readAsDataURL(file);
  };

  const limpiarLogo = () => {
    if (fileRef.current) fileRef.current.value = "";
    setEmpresa({ logo: "" }); // ✅ solo limpia logo
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
          setEmpresa({
            ruc: e.target.value.replace(/\D/g, "").slice(0, 11),
          })
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
          setEmpresa({
            telefono: e.target.value.replace(/[^\d+]/g, ""),
          })
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
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer z-0"
            onChange={onLogoFile}
          />

          {empresa.logo ? (
            <>
              <img
                src={empresa.logo}
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
              Selecciona tu logo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
