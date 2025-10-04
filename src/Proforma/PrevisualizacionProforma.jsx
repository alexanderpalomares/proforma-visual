// src/Proforma/PrevisualizacionProforma.jsx
import React, { useMemo, useRef, useState } from "react";
import { peekNextProformaNumber, getNextProformaNumber } from "../utils/numeracionProforma";

import Header from "./Header";
import ClienteInfo from "./ClienteInfo";
import ProductoRow from "./ProductoRow";
import Totales from "./Totales";
import Footer from "./Footer";

const PEN = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (n) => PEN.format(Number(n) || 0);

// ✅ Convierte imágenes a Base64 para Puppeteer (para evitar rutas locales rotas)
const toDataURL = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const maxWidth = 600;
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = src;
  });

const PrevisualizacionProforma = ({ cliente, productos, empresa }) => {
  const containerRef = useRef(null);
  const [generando, setGenerando] = useState(false);

  const PDF_SERVER_URL = import.meta.env.VITE_PDF_SERVER_URL;
  const proformaNumber = useMemo(() => peekNextProformaNumber(), []);

  const handleExportPDF = async () => {
    try {
      setGenerando(true);

      // 🖼️ 1. Convertir imágenes internas a Base64
      const imgs = containerRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(imgs).map(async (img) => {
          if (!img.src.startsWith("data:")) {
            try {
              const dataUri = await toDataURL(img.src);
              img.src = dataUri;
            } catch (err) {
              console.warn("⚠️ No se pudo convertir imagen:", img.src);
            }
          }
        })
      );

      // 🧱 2. Construir HTML limpio
      const rawHTML = containerRef.current.innerHTML;
      const html = `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8" />
            <style>
              @page { size: A4; margin: 0; }
              body {
                font-family: Arial, Helvetica, sans-serif;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                margin: 0;
                padding: 0;
              }
              * { box-sizing: border-box; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            ${rawHTML}
          </body>
        </html>
      `;

      const filename = `PROFORMA_${proformaNumber}.pdf`;

      // 🌐 3. Llamada al servidor
      const response = await fetch(`${PDF_SERVER_URL}/api/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, filename }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error al generar PDF: ${text}`);
      }

      // 🧠 4. Usar arrayBuffer para evitar corrupción
      const arrayBuffer = await response.arrayBuffer();
      console.log("📏 Tamaño del arrayBuffer recibido:", arrayBuffer.byteLength, "bytes");

      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // 🔢 Avanzar numeración local
      getNextProformaNumber();

      // ⏳ Revocar URL después de un pequeño delay
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      console.error("❌ Error en exportación PDF:", err);
      alert("Error al generar el PDF. Revisa la consola para más detalles.");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="p-4">
      <div ref={containerRef} className="bg-white p-6 rounded-lg shadow">
        <Header empresa={empresa} proformaNumber={proformaNumber} />
        <ClienteInfo cliente={cliente} />
        {productos.map((p, i) => (
          <ProductoRow key={i} producto={p} formatMoney={formatMoney} />
        ))}
        <Totales productos={productos} formatMoney={formatMoney} />
        <Footer />
      </div>

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
