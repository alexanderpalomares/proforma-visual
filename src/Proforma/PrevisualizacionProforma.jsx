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

// ✅ Optimiza imágenes para incrustarlas como Base64
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
      console.log("🚀 Iniciando exportación PDF...");

      // 🖼️ Clonar el contenedor
      const container = containerRef.current.cloneNode(true);
      const images = container.querySelectorAll('img');
      
      console.log(`📸 Encontradas ${images.length} imágenes`);

      // 🔄 Convertir imágenes a Base64
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        try {
          if (img.src && !img.src.startsWith('data:')) {
            console.log(`🔄 Convirtiendo imagen ${i + 1}:`, img.src);
            const dataURL = await toDataURL(img.src);
            img.src = dataURL;
            console.log(`✅ Imagen ${i + 1} convertida`);
          }
        } catch (err) {
          console.warn(`⚠️ No se pudo convertir imagen ${i + 1}:`, err);
        }
      }

      const rawHTML = container.innerHTML;
      console.log(`📝 HTML generado: ${rawHTML.length} caracteres`);

      const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
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
              display: block;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
          </style>
        </head>
        <body>
          ${rawHTML}
        </body>
        </html>
      `;

      const filename = `PROFORMA_PF-2025-${String(proformaNumber).padStart(4, '0')}.pdf`;
      console.log(`📎 Nombre del archivo: ${filename}`);

      const serverUrl = `${PDF_SERVER_URL}/api/pdf`;
      console.log(`🌐 Enviando a: ${serverUrl}`);

      const response = await fetch(serverUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/pdf"
        },
        body: JSON.stringify({ html, filename }),
      });

      console.log(`📡 Respuesta del servidor: ${response.status} ${response.statusText}`);
      console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));

      const contentType = response.headers.get("content-type");
      console.log(`📄 Content-Type: ${contentType}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      // 🔍 Leer la respuesta como ArrayBuffer para inspeccionar
      const arrayBuffer = await response.arrayBuffer();
      console.log(`📦 Tamaño recibido: ${arrayBuffer.byteLength} bytes`);

      // Verificar los primeros bytes (debe ser %PDF)
      const uint8Array = new Uint8Array(arrayBuffer);
      const header = String.fromCharCode(...uint8Array.slice(0, 4));
      console.log(`🔍 Header del archivo: "${header}" (esperado: "%PDF")`);

      if (header !== '%PDF') {
        // Ver los primeros 100 caracteres para debug
        const preview = String.fromCharCode(...uint8Array.slice(0, 100));
        console.error('❌ No es un PDF válido. Primeros 100 bytes:', preview);
        throw new Error('El archivo recibido no es un PDF válido');
      }

      console.log('✅ PDF válido recibido');

      // Crear blob desde el ArrayBuffer
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      console.log(`💾 Blob creado: ${blob.size} bytes, tipo: ${blob.type}`);

      if (blob.size === 0) {
        throw new Error('El PDF está vacío');
      }

      // Descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Pequeño delay antes de revocar la URL
      setTimeout(() => URL.revokeObjectURL(url), 100);

      getNextProformaNumber();
      console.log('✅ PDF descargado exitosamente');
      alert('✅ PDF generado correctamente');

    } catch (err) {
      console.error("❌ Error completo:", err);
      console.error("Stack:", err.stack);
      alert(`❌ Error al generar el PDF:\n\n${err.message}\n\nRevisa la consola (F12) para más detalles.`);
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
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50 transition-colors"
        >
          {generando ? "⏳ Generando PDF..." : "📄 Exportar PDF"}
        </button>
      </div>
    </div>
  );
};

export default PrevisualizacionProforma;