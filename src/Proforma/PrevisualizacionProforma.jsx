import React, { useMemo, useRef, useState, useEffect } from "react";
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
 * 🧠 Convierte una imagen a Base64 optimizada.
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

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let hasTransparency = false;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 255) {
          hasTransparency = true;
          break;
        }
      }

      if (hasTransparency) {
        resolve(canvas.toDataURL("image/png"));
      } else {
        resolve(canvas.toDataURL("image/jpeg", quality));
      }
    };
    img.onerror = reject;
    img.src = src;
  });

const PrevisualizacionProforma = ({
  cliente,
  productos,
  empresa,
  tipoDocumento,
  observaciones = "",
  banco = {},
  onVolver,       // 👈 Para retroceder un paso (al paso 5)
  onResetWizard,  // 👈 Para reiniciar el wizard tras exportar
}) => {
  const containerRef = useRef(null);
  const [generando, setGenerando] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const proformaNumber = useMemo(() => peekNextProformaNumber(), []);

  // 🔔 Oculta el toast automáticamente después de unos segundos
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // 📤 Exportar PDF
  const handleExportPDF = async () => {
    try {
      setGenerando(true);

      const container = containerRef.current;

      // Convertir imágenes a Base64
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

      const rawHTML = container.innerHTML;

      // HTML completo para Puppeteer
      const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');
            body {
              font-family: sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
              padding: 0;
            }
            h1, h2, h3, .doc-title {
              font-family: 'Montserrat', sans-serif;
              font-weight: 800;
              text-transform: uppercase;
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

      const response = await fetch(`${PDF_SERVER_URL}/api/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, filename }),
      });

      if (!response.ok) throw new Error("Error en la generación del PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      getNextProformaNumber();
      setExportSuccess(true);
      setShowToast(true);
    } catch (err) {
      console.error("❌ Error en exportación PDF:", err);
      alert("Ocurrió un error al generar el PDF. Revisa la consola.");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div>
      {/* 🟦 Línea superior + microtexto */}
      <div className="border-t pt-2 mb-4">
        <p className="font-semibold text-sm">
          Revisa que toda la información esté correcta antes de generar la proforma.
        </p>
      </div>

      {/* 📄 Contenedor de la previsualización */}
      <div
        ref={containerRef}
        className="bg-white p-6 rounded-lg shadow max-w-[800px] mx-auto"
      >
        <Header
          empresa={empresa}
          numero={proformaNumber}
          fecha={cliente?.fecha || "Fecha no registrada"}
          tipoDocumento={tipoDocumento}
        />
        <ClienteInfo cliente={cliente} />
        {productos.map((p, i) => (
          <ProductoRow key={i} producto={p} formatMoney={formatMoney} />
        ))}
        <Totales productos={productos} formatMoney={formatMoney} />
        <Footer empresa={empresa} observaciones={observaciones} banco={banco} />
      </div>

      {/* 📌 Acciones */}
      <div className="mt-4 flex justify-end gap-3">
        {!exportSuccess ? (
          <>
            <button
              onClick={onVolver}
              className="flex items-center justify-center gap-2 min-w-[120px] bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <span className="text-lg">←</span>
              <span>Volver</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={generando}
              className="min-w-[120px] bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50 transition-colors font-medium"
            >
              {generando ? "Generando..." : "Exportar PDF"}
            </button>
          </>
        ) : (
          <div className="w-full text-center">
            <p className="text-green-600 font-semibold mb-2">
              ✅ Proforma exportada correctamente
            </p>
            <button
              onClick={onResetWizard}
              className="min-w-[120px] bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Crear nueva proforma
            </button>
          </div>
        )}
      </div>

      {/* 🌟 Toast flotante */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#16a34a",
            color: "white",
            padding: "12px 18px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontWeight: "600",
            fontSize: "14px",
            opacity: showToast ? 1 : 0,
            transform: showToast
              ? "translateY(0) scale(1)"
              : "translateY(20px) scale(0.95)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            zIndex: 9999,
          }}
        >
          ✅ Proforma exportada correctamente
        </div>
      )}
    </div>
  );
};

export default PrevisualizacionProforma;
