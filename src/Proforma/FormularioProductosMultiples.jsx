// src/Proforma/FormularioProductosMultiples.jsx
import React, { useState } from "react";

export default function FormularioProductosMultiples({
  productos,
  setProductos,
  manejarMostrarPrevisualizacion,
}) {
  const [errorCampos, setErrorCampos] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Conversión numérica segura
  const toNumber = (v) => {
    if (v === null || v === undefined) return 0;
    const n = Number(String(v).trim().replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  // Procesa los archivos y los convierte en productos
  const procesarArchivos = (archivos) => {
    if (!archivos.length) return;

    const nuevos = archivos.map((archivo) => ({
      id: crypto.randomUUID(),
      imagen: archivo,
      imagenPreview: URL.createObjectURL(archivo),
      nombre: "",
      descripcion: "",
      precio: "",
      cantidad: "",
      importe: 0,
    }));

    setProductos([...(productos || []), ...nuevos]);
  };

  // Carga múltiple de imágenes con input
  const handleImagenes = (e) => {
    const archivos = Array.from(e.target.files || []);
    procesarArchivos(archivos);
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const archivos = Array.from(e.dataTransfer.files || []);
    procesarArchivos(archivos);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Cambia valores y recalcula importe
  const handleChange = (id, name, value) => {
    const actualizados = (productos || []).map((p) => {
      if (p.id !== id) return p;
      const actualizado = { ...p, [name]: value };

      const precio = toNumber(name === "precio" ? value : p.precio);
      const cantidad = toNumber(name === "cantidad" ? value : p.cantidad);
      actualizado.importe = precio * cantidad;

      return actualizado;
    });
    setProductos(actualizados);
  };

  // Elimina un producto
  const eliminarProducto = (id) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  // Abre previsualización (validación no bloqueante)
  const abrirProforma = () => {
    const hayFaltantes = (productos || []).some(
      (p) =>
        !p || !p.nombre || toNumber(p.precio) === 0 || toNumber(p.cantidad) === 0
    );
    setErrorCampos(hayFaltantes);
    manejarMostrarPrevisualizacion();
  };

  return (
    <div className="space-y-4">
      {/* Dropzone intuitivo con drag & drop */}
      <div>
        <label className="block text-sm font-medium mb-2">Agregar imágenes</label>

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
            {isDragging
              ? "Suelta las imágenes aquí"
              : "Haz clic o arrastra tus imágenes aquí"}
          </p>
        </div>

        {errorCampos && (
          <p className="text-sm text-amber-600 mt-2">
            Hay productos con datos incompletos. Revísalos antes de enviar al cliente.
          </p>
        )}
      </div>

      {/* Lista de productos */}
      {productos.length > 0 && (
        <div className="space-y-4">
          {productos.map((p, index) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 relative bg-white shadow-sm"
            >
              {/* Contador y botón eliminar */}
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

              {/* Campos */}
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
                  <label className="block text-sm font-medium mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={p.descripcion}
                    onChange={(e) =>
                      handleChange(p.id, "descripcion", e.target.value)
                    }
                    className="w-full border rounded px-3 py-2"
                    rows={2}
                    maxLength={150}
                    style={{ resize: "none" }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {p.descripcion.length}/150 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Precio (S/)
                  </label>
                  <input
                    type="number"
                    value={p.precio}
                    onChange={(e) => handleChange(p.id, "precio", e.target.value)}
                    className="border rounded px-3 py-2"
                    style={{ width: "120px" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={p.cantidad}
                    onChange={(e) =>
                      handleChange(p.id, "cantidad", e.target.value)
                    }
                    className="border rounded px-3 py-2"
                    style={{ width: "120px" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Importe (S/)
                  </label>
                  <input
                    type="text"
                    value={toNumber(p.importe).toFixed(2)}
                    readOnly
                    className="border rounded px-3 py-2 bg-gray-100"
                    style={{ width: "120px" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón generar proforma */}
      {productos.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={abrirProforma}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Generar proforma
          </button>
        </div>
      )}
    </div>
  );
}
