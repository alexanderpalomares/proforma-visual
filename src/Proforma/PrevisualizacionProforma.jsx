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

// ✅ Optimiza imágenes para incrustarlas como Base64 (para Puppeteer)
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

      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      resolve(dataUrl);
    };
    img.onerror = reject;
    img.src = src;
  });

const inlineImagesInNode = async (rootEl) => {
  const imgs = rootEl.querySelectorAll("img");
  await Promise.all(
    Array.from(imgs).map(async (img) => {
      const src = img.getAttribute("src");
      if (!src) return;
      try {
        const dataUrl = await toDataURL(src);
        img.setAttribute("src", dataUrl);
      } catch (_) {}
    })
  );
};

// 🧠 Genera HTML autónomo con @font-face (fuentes desde /public/fonts)
const buildHTMLForPDF = (node, { title = "Documento" } = {}) => {
  const head = `
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <style>
      @font-face {
        font-family: 'Poppins';
        src: url('/fonts/Poppins-Regular.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('/fonts/Poppins-SemiBold.ttf') format('truetype');
        font-weight: 600;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('/fonts/Poppins-Bold.ttf') format('truetype');
        font-weight: 700;
        font-style: normal;
      }
      @font-face {
        font-family: 'Poppins';
        src: url('/fonts/Poppins-ExtraBold.ttf') format('truetype');
        font-weight: 800;
        font-style: normal;
      }

      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      html, body {
        margin: 0;
        padding: 0;
        background: #fff;
        font-family: 'Poppins', Helvetica, Arial, sans-serif;
      }
      .pdf-page {
        width: 794px;
        margin: 0 auto;
      }
      @page {
        size: A4;
        margin: 20px;
      }
    </style>
  `;
  const body = `<div class="pdf-page">${node.outerHTML}</div>`;
  return `<!doctype html><html><head><title>${title}</title>${head}</head><body>${body}</body></html>`;
};

const styles = {
  page: {
    width: 794,
    margin: "0 auto",
    padding: 24,
    backgroundColor: "#ffffff",
    fontFamily: "Poppins, Helvetica, Arial, sans-serif",
    color: "#000",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  btn: {
    padding: "8px 16px",
    borderRadius: 6,
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
  },
  btnGreen: { backgroundColor: "#16a34a" },
  btnYellow: { backgroundColor: "#eab308", cursor: "wait" },
  btnBlue: { backgroundColor: "#2563eb" },
  btnRed: { backgroundColor: "#dc2626" },
  btnGray: { backgroundColor: "#6b7280" },
  overlaySuccess: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  successBox: {
    backgroundColor: "#fff",
    padding: "24px 32px",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
    fontSize: 18,
    fontWeight: 700,
    color: "#16a34a",
    fontFamily: "Poppins, sans-serif",
  },
};

export default function PrevisualizacionProforma({
  empresa = {},
  cliente = {},
  documento = {},
  productos = [],
  observaciones = "",
  banco = {},
  onVolver = () => {},
}) {
  const ref = useRef(null);
  const [pdfStatus, setPdfStatus] = useState("idle");

  const numeroPreview = useMemo(() => peekNextProformaNumber(), []);
  const [numeroFinal, setNumeroFinal] = useState(null);

  const total = useMemo(() => {
    return productos.reduce((acc, p) => {
      const precio = Number(p.precio) || 0;
      const cantidad = Number(p.cantidad) || 0;
      return acc + precio * cantidad;
    }, 0);
  }, [productos]);

  const PDF_SERVER_URL = import.meta.env.VITE_PDF_SERVER_URL || "http://localhost:4000";

  const handleExportPdfPro = async () => {
    try {
      setPdfStatus("loading");
      const numero = getNextProformaNumber();
      setNumeroFinal(numero);

      const original = ref.current;
      const clone = original.cloneNode(true);
      await inlineImagesInNode(clone);

      const html = buildHTMLForPDF(clone, { title: `${documento.tipo || "PROFORMA"} ${numero}` });

      const resp = await fetch(`${PDF_SERVER_URL}/api/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          filename: `${documento.tipo || "PROFORMA"}_${numero}.pdf`,
        }),
      });

      if (!resp.ok) throw new Error("Fallo al generar PDF en el servidor");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${documento.tipo || "PROFORMA"}_${numero}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setPdfStatus("success");
      setTimeout(() => {
        setPdfStatus("idle");
        onVolver?.();
      }, 2000);
    } catch (err) {
      console.error("Export server PDF error:", err);
      setPdfStatus("error");
      setTimeout(() => setPdfStatus("idle"), 3000);
    }
  };

  const exportBtnStyle =
    pdfStatus === "idle"
      ? { ...styles.btn, ...styles.btnGreen }
      : pdfStatus === "loading"
      ? { ...styles.btn, ...styles.btnYellow }
      : pdfStatus === "success"
      ? { ...styles.btn, ...styles.btnBlue }
      : { ...styles.btn, ...styles.btnRed };

  const numeroParaMostrar = numeroFinal ?? numeroPreview;

  return (
    <div>
      {pdfStatus === "success" && (
        <div style={styles.overlaySuccess}>
          <div style={styles.successBox}>✅ Documento generado con éxito</div>
        </div>
      )}

      <div ref={ref} style={styles.page}>
        <Header
          empresa={empresa}
          numero={numeroParaMostrar}
          fecha={cliente.fecha}
          tipoDocumento={documento.tipo || "PROFORMA"}
        />
        <ClienteInfo cliente={cliente} />
        <div>
          {productos.map((p, idx) => (
            <ProductoRow key={idx} producto={p} idx={idx} formatMoney={formatMoney} />
          ))}
        </div>
        <Totales total={total} formatMoney={formatMoney} />
        <Footer empresa={empresa} observaciones={observaciones} banco={banco} />
      </div>

      <div className="print:hidden" style={styles.actions}>
        <button
          type="button"
          onClick={handleExportPdfPro}
          disabled={pdfStatus === "loading"}
          style={exportBtnStyle}
        >
          {pdfStatus === "idle" && "Descargar PDF profesional"}
          {pdfStatus === "loading" && "Generando PDF..."}
          {pdfStatus === "success" && "Documento listo ✅"}
          {pdfStatus === "error" && "Error al generar PDF"}
        </button>

        <button
          type="button"
          onClick={onVolver}
          style={{ ...styles.btn, ...styles.btnGray }}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
