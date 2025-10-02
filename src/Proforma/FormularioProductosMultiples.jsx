import React, { useState } from "react";

export default function FormularioProductosMultiples({ data = [], onChange }) {
  const [errorCampos, setErrorCampos] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const toNumber = (v) => {
    if (v === null || v === undefined) return 0;
    const n = Number(String(v).trim().replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const crearProductosDesdeArchivos = (archivos) => {
    if (!archivos?.length) return [];
    const imgs = archivos.filter((f) => f.type?.startsWith("image/"));
    return imgs.map((archivo) => ({
      id: crypto.randomUUID(),
      imagen: archivo,
      imagenPreview: URL.createObjectURL(archivo),
      nombre: "",
      descripcion: "",
      precio: "",
      cantidad: "",
      importe: 0,
    }));
  };

  const handleImagenes = (e) => {
    const archivos = Array.from(e.target.files || []);
    const nuevos = crearProductosDesdeArchivos(archivos);
    if (!nuevos.length) return;
    onChange([...(data || []), ...nuevos]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const archivos = Array.from(e.dataTransfer.files || []);
    const nuevos = crearProductosDesdeArchivos(archivos);
    if (!nuevos.length) return;
    onChange([...(data || []), ...nuevos]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (id, name, value) => {
    const actualizados = (data || []).map((p) => {
      if (p.id !== id) return p;
      const actualizado = { ...p, [name]: value };
      const precio = toNumber(name === "precio" ? value : p.precio);
      const cantidad = toNumber(name === "cantidad" ? value : p.cantidad);
      actualizado.importe = precio * cantidad;
      return actualizado;
    });
    onChange(actualizados);
  };

  const eliminarProducto = (id) => {
    const prod = data.find((p) => p.id === id);
    if (prod?.imagenPreview) URL.revokeObjectURL(prod.imagenPreview);
    onChange(data.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer relative transition ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagenes}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <p className="text-gray-500">
          {isDragging ? "Suelta las imágenes aquí" : "Haz clic o arrastra tus imágenes aquí"}
        </p>
      </div>

      {errorCampos && (
        <p className="text-sm text-amber-600 mt-2">
          Hay productos con datos incompletos. Revísalos antes de enviar al cliente.
        </p>
      )}

      {data.length > 0 && (
        <div className="space-y-4">
          {data.map((p, index) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 relative bg-white shadow-sm"
            >
              <span className="absolute -top-3 left-3 bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => eliminarProducto(p.id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
              >
                Eliminar
              </button>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                  {p.imagenPreview && (
                    <img
                      src={p.imagenPreview}
                      alt={p.nombre || "producto"}
                      className="h-28 w-auto object-contain border rounded"
                    />
                  )}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <input
                      type="text"
                      value={p.nombre}
                      onChange={(e) => handleChange(p.id, "nombre", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <textarea
                      value={p.descripcion}
                      onChange={(e) => handleChange(p.id, "descripcion", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      rows={2}
                      maxLength={150}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Precio (S/)</label>
                    <input
                      type="number"
                      value={p.precio}
                      onChange={(e) => handleChange(p.id, "precio", e.target.value)}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cantidad</label>
                    <input
                      type="number"
                      value={p.cantidad}
                      onChange={(e) => handleChange(p.id, "cantidad", e.target.value)}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Importe (S/)</label>
                    <input
                      type="text"
                      value={toNumber(p.importe).toFixed(2)}
                      readOnly
                      className="border rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
