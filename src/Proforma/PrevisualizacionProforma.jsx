// src/Proforma/PrevisualizacionProforma.jsx
import React, { useMemo, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ProformaPDF from "../pdf/ProformaPDF";
import { peekNextProformaNumber, getNextProformaNumber } from "../utils/numeracionProforma";

// Bloques refactorizados (HTML normal, no react-pdf)
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

const convertToPngBase64 = (fileOrUrl) =>
  new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = (err) => reject(err);
      img.src = fileOrUrl;
    } catch (e) {
      reject(e);
    }
  });

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

  const handleExportPdfPro = async () => {
    try {
      setPdfStatus("loading");
      const numero = getNextProformaNumber();
      setNumeroFinal(numero);

      const productosReady = await Promise.all(
        productos.map(async (p) => {
          if (p.imagenForPdf) return p;
          const src = p.imagenFile || p.imagenPreview || p.imagen;
          if (!src) return p;
          try {
            const imagenForPdf = await convertToPngBase64(src);
            return { ...p, imagenForPdf };
          } catch {
            return p;
          }
        })
      );

      const blob = await pdf(
        <ProformaPDF
          empresa={empresa}
          cliente={cliente}
          productos={productosReady}
          numeroProforma={numero}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PROFORMA_${numero}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setPdfStatus("success");
      setTimeout(() => {
        setPdfStatus("idle");
        onLimpiarCliente?.();
        onLimpiarProductos?.();
        onVolver?.();
      }, 2500);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      setPdfStatus("error");
      setTimeout(() => setPdfStatus("idle"), 3500);
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
          <div style={styles.successBox}>✅ PDF generado con éxito</div>
        </div>
      )}

      <div ref={ref} style={styles.page}>
        {/* HEADER */}
        <Header empresa={empresa} numero={numeroParaMostrar} fecha={cliente.fecha} />

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
        <Footer empresa={empresa} />
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
          {pdfStatus === "success" && "PDF listo ✅"}
          {pdfStatus === "error" && "Error al generar PDF"}
        </button>

        <button type="button" onClick={onVolver} style={{ ...styles.btn, ...styles.btnGray }}>
          Volver
        </button>
      </div>
    </div>
  );
}
