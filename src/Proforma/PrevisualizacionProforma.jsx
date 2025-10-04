// src/Proforma/PrevisualizacionProforma.jsx
import React, { useMemo, useRef, useState } from "react";
import { peekNextProformaNumber, getNextProformaNumber } from "../utils/numeracionProforma";

import Header from "./Header";
import ClienteInfo from "./ClienteInfo";
import ProductoRow from "./ProductoRow";
import Totales from "./Totales";
import Footer from "./Footer";

// 📝 Formato de moneda PEN
const PEN = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (n) => PEN.format(Number(n) || 0);

// 🌐 URL del backend (Render) desde .env
const PDF_SERVER_URL = import.meta.env.VITE_PDF_SERVER_URL;

/**
 * 🧠 Convierte una imagen a Base64, redimensionándola y comprimiéndola
 * - maxWidth: ancho máximo permitido
 * - quality: compresión JPEG (0.8 = 80 %)
 */
const toDataURL = (src, maxWidth = 800, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = src;
  });

const PrevisualizacionProforma = ({ cliente, productos, empresa }) => {
  const containerRef = useRef(null);
  const [generando, setGenerando] = useState(false);
  const proformaNumber = useMemo(() => peekNextProformaNumber(), []);

  // 📤 Función para exportar la proforma como PDF
  const handleExportPDF = async () => {
    try {
      setGenerando(true);

      // 1️⃣ Referencia al contenedor actual
      const container = containerRef.current;

      // 2️⃣ Convertir todas las imágenes a Base64 optimizadas
      const imgTags = container.querySelectorAll("img");
      await Promise.all(
        Array.from(imgTags).map(async (img) => {
          if (img.src && !img.src.startsWith("data:")) {
            try {
              const dataUrl = await toDataURL(img.src);
              img.src = dataUrl;
            } catch (err) {
              console.warn("No se pudo convertir imagen:", img.src, err);
            }
          }
        })
      );

      // 3️⃣ Capturamos el HTML limpio con imágenes embebidas optimizadas
      const rawHTML = container.innerHTML;

      const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
              padding: 0;
            }
            * {
              box-sizing: border-box;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          ${rawHTML}
        </body>
        </html>
      `;

      const filename = `PROFORMA_${proformaNumber}.pdf`;

      // 4️⃣ Enviamos el HTML al backend Render
      const response = await fetch(`${PDF_SERVER_URL}/api/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, filename }),
      });

      if (!response.ok) throw new Error("Error en la generación del PDF");

      // 5️⃣ Descargamos el PDF
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      getNextProformaNumber();
    } catch (err) {
      console.error("❌ Error en exportación PDF:", err);
      alert("Ocurrió un error al generar el PDF. Revisa la consola.");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="p-4">
      <div
        ref={containerRef}
        className="bg-white p-6 rounded-lg shadow max-w-[800px] mx-auto"
      >
        <Header empresa={empresa} proformaNumber={proformaNumber} />
        <ClienteInfo cliente={cliente} />
        {productos.map((p, i) => (
          <ProductoRow key={i} producto={p} formatMoney={formatMoney} />
        ))}
        <Totales productos={productos} formatMoney={formatMoney} />
        <Footer />
      </div>

      {/* 📌 Botón de exportación */}
      <div className="mt-4 text-right">
        <button
          onClick={handleExportPDF}
          disabled={generando}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          {generando ? "Generando PDF..." : "Exportar PDF"}
        </button>
      </div>
    </div>
  );
};

export default PrevisualizacionProforma;
