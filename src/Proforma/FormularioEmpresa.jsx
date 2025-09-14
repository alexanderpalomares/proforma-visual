import React, { useRef } from "react";

export default function FormularioEmpresa({ empresa, setEmpresa }) {
  const fileRef = useRef(null);
  const input =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const onChange = (e) =>
    setEmpresa((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Extrae @usuario desde texto o URL
  const normalizeInstagram = (raw) => {
    if (!raw) return "";
    const v = String(raw).trim();
    // si viene URL, saca el username
    const m =
      v.match(/instagram\.com\/([^/?#]+)/i) ||
      v.match(/(?:^|[^@\w])@([\w\.]+)/); // @usuario
    const user = m ? (m[1] || m[0].replace("@", "")).replace(/^\@/, "") : v.replace(/^@/, "");
    return user ? `@${user}` : "";
  };

  const onInstagramBlur = (e) => {
    const normal = normalizeInstagram(e.target.value);
    setEmpresa((prev) => ({ ...prev, instagram: normal }));
  };

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
          setEmpresa((p) => ({ ...p, ruc: e.target.value.replace(/\D/g, "").slice(0, 11) }))
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
          setEmpresa((p) => ({ ...p, telefono: e.target.value.replace(/[^\d+]/g, "") }))
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
        placeholder="Ej: www.carlitosbicentro.com"
        value={empresa.web || ""}
        onChange={onChange}
      />


      {/* Subida de logo con vista previa */}
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
        <div className="flex gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={input}
            onChange={onLogoFile}
          />
          <button
            type="button"
            onClick={limpiarLogo}
            className="px-3 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Quitar logo
          </button>
        </div>

        {empresa.logo ? (
          <img
            src={empresa.logo}
            alt="Logo"
            className="h-16 md:h-20 w-auto object-contain justify-self-start md:justify-self-end"
          />
        ) : (
          <span className="text-sm text-gray-500 justify-self-start md:justify-self-end">
            (Sin logo)
          </span>
        )}
      </div>


    </div>
  );
}
