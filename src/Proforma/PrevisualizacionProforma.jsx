// src/Proforma/PrevisualizacionProforma.jsx
import React, { useMemo, useRef, useState } from "react";
import { peekNextProformaNumber, getNextProformaNumber } from "../utils/numeracionProforma";

// Bloques refactorizados (HTML normal)
import Header from "./Header";
import ClienteInfo from "./ClienteInfo";
import ProductoRow from "./ProductoRow";
import Totales from "./Totales";
import Footer from "./Footer";

// ─────────────────── Función utilitaria ───────────────────
const PEN = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (n) => PEN.format(Number(n) || 0);

// Convierte un IMG src en dataURL PNG
const toDataURL = (src) =>
  new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = src;
    } catch (e) {
      reject(e);
    }
  });

// Recorre el nodo clonado y reemplaza <img src> por dataURL
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

// Construye HTML completo para Puppeteer
const buildHTMLForPDF = (node, { title = "Documento" } = {}) => {
  const head = `
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet"/>
    <style>
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      html, body { margin: 0; padding: 0; background: #fff; }
      .pdf-page { width: 794px; margin: 0 auto; font-family: Poppins, Helvetica, Arial, sans-serif; }
      @page { size: A4; margin: 20px; }
    </style>
  `;
  const body = `<div class="pdf-page">${node.outerHTML}</div>`;
  return `<!doctype html><html><head><title>${title}</title>${head}</head><body>${body}</body></html>`;
};

// ─────────────────── Estilos globales ───────────────────
const styles = {
  page: {
    width: 794,
    margin: "0 auto",
    padding: 24,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
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
  productos = [],
  tipoDocumento = "PROFORMA",
  observaciones = "",
  banco = {},
  onVolver = () => {},
  onLimpiarCliente = () => {},
  onLimpiarProductos = () => {},
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

  // URL del backend PDF
  const PDF_SERVER_URL = import.meta.env.VITE_PDF_SERVER_URL || "http://localhost:4000";

  const handleExportPdfPro = async () => {
    try {
      setPdfStatus("loading");
      const numero = getNextProformaNumber();
      setNumeroFinal(numero);

      // 1) Clonar nodo del preview
      const original = ref.current;
      const clone = original.cloneNode(true);

      // 2) Incrustar imágenes
      await inlineImagesInNode(clone);

      // 3) Construir HTML
      const html = buildHTMLForPDF(clone, { title: `${tipoDocumento} ${numero}` });

      // 4) Enviar al backend
      const resp = await fetch(`${PDF_SERVER_URL}/api/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          filename: `${tipoDocumento}_${numero}.pdf`,
        }),
      });

      if (!resp.ok) throw new Error("Fallo al generar PDF en el servidor");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${tipoDocumento}_${numero}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setPdfStatus("success");
      setTimeout(() => {
        setPdfStatus("idle");
        onLimpiarCliente?.();
        onLimpiarProductos?.();
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
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {pdfStatus === "success" && (
        <div style={styles.overlaySuccess}>
          <div style={styles.successBox}>✅ Documento generado con éxito</div>
        </div>
      )}

      <div ref={ref} style={styles.page}>
        {/* HEADER */}
        <Header
          empresa={empresa}
          numero={numeroParaMostrar}
          fecha={cliente.fecha}
          tipoDocumento={tipoDocumento}
        />

        {/* CLIENTE */}
        <ClienteInfo cliente={cliente} />

        {/* PRODUCTOS */}
        <div>
          {productos.map((p, idx) => (
            <ProductoRow key={idx} producto={p} idx={idx} formatMoney={formatMoney} />
          ))}
        </div>

        {/* TOTALES */}
        <Totales total={total} formatMoney={formatMoney} />

        {/* FOOTER */}
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

        <button type="button" onClick={onVolver} style={{ ...styles.btn, ...styles.btnGray }}>
          Volver
        </button>
      </div>
    </div>
  );
}
