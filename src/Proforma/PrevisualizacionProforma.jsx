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

// ✅ Convierte imágenes a Base64 para que Puppeteer pueda renderizarlas
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

// ✅ Carga el CSS de Tailwind desde CDN y lo devuelve como string
const fetchTailwindCSS = async () => {
  const res = await fetch("https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css");
  return await res.text();
};

const PrevisualizacionProforma = ({ cliente, productos, empresa }) => {
  const containerRef = useRef(null);
  const [generando, setGenerando] = useState(false);

  const PDF_SERVER_URL = import.meta.env.VITE_PDF_SERVER_URL;
  const proformaNumber = useMemo(() => peekNextProformaNumber(), []);

  const handleExportPDF = async () => {
    try {
      setGenerando(true);

      // 📝 Clonamos el contenedor para no alterar el DOM real
      const containerClone = containerRef.current.cloneNode(true);

      // 🧠 Convertimos todas las imágenes a Base64
      const imgs = containerClone.querySelectorAll("img");
      for (const img of imgs) {
        if (img.src.startsWith("http") || img.src.startsWith("blob:")) {
          try {
            const dataUrl = await toDataURL(img.src);
            img.src = dataUrl;
          } catch (err) {
            console.warn("⚠️ No se pudo convertir imagen a Base64:", img.src, err);
          }
        }
      }

      // 🎨 Incrustamos Tailwind CSS
      const tailwindCSS = await fetchTailwindCSS();

      const rawHTML = containerClone.innerHTML;
      const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            ${tailwindCSS}
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
              padding: 0;
            }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          ${rawHTML}
        </body>
        </html>
      `;

      const filename = `PROFORMA_${proformaNumber}.pdf`;

      const response = await fetch(`${PDF_SERVER_URL}/api/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, filename }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error del servidor PDF:", errorText);
        throw new Error(`Error al generar PDF: ${errorText}`);
      }

      // 📄 Verificamos si el backend devolvió HTML en vez de PDF (error silencioso)
      const blob = await response.blob();
      const textCheck = await blob.text();
      if (textCheck.startsWith("<!DOCTYPE html>") || textCheck.includes("<html")) {
        console.error("⚠️ El servidor devolvió HTML en lugar de PDF:\n", textCheck);
        alert("El servidor devolvió un error HTML en vez de un PDF. Revisa la consola.");
        return;
      }

      // ✅ Descargamos el PDF real
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      // 🔢 Avanzar numeración local
      getNextProformaNumber();
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
