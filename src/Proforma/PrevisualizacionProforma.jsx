// src/Proforma/PrevisualizacionProforma.jsx
import React, { useMemo, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ProformaPDF from "../pdf/ProformaPDF";
import { peekNextProformaNumber, getNextProformaNumber } from "../utils/numeracionProforma";

// ─────────────────── Formateo de dinero ───────────────────
const PEN = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (n) => PEN.format(Number(n) || 0);

// ─────────────────── Conversión de imágenes a PNG ───────────────────
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

// ─────────────────── Estilos ───────────────────
const styles = {
  page: {
    width: 794,
    margin: "0 auto",
    padding: 24,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#000",
  },

  // Header Moderno
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerLeft: { display: "flex", flexDirection: "row", gap: 14 },
  logo: { width: 70, height: 70, borderRadius: "50%", objectFit: "cover" },
  empresaNombre: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Poppins, sans-serif",
    color: "#111",
    marginBottom: 4,
  },
  empresaDato: { fontSize: 13, color: "#555", marginBottom: 2 },

  headerRight: { textAlign: "right" },
  proformaTitle: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Poppins, sans-serif",
    color: "#1e293b",
  },
  proformaNumber: { fontSize: 13, color: "#334155", marginTop: 4 },
  proformaDate: { fontSize: 13, color: "#334155", marginTop: 2 },

  // Cliente
  clienteBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: "12px 16px",
    marginBottom: 16,
  },
  clienteLabel: { fontWeight: 700, fontSize: 14, marginBottom: 8, color: "#111" },
  clienteDato: { fontSize: 13, marginBottom: 4, color: "#444" },

  // Productos
  productosWrap: { display: "flex", flexDirection: "column" },
  productoRow: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  productoSeparator: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid #EDEDED",
  },
  productoImgLeft: {
    width: 350,
    height: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  productoImgTag: { width: "100%", height: "100%", objectFit: "contain" },
  productoDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    flex: "1 1 0",
    minWidth: 320,
    maxWidth: 320,
    marginLeft: "auto",
  },
  productoName: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: 700,
    fontSize: 17,
    textTransform: "uppercase",
    textAlign: "right",
    marginBottom: 10,
  },
  productoDesc: {
    fontSize: 13,
    textAlign: "right",
    maxWidth: "100%",
    alignSelf: "flex-end",
    lineHeight: 1.2,
  },
  priceBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
    width: "100%",
    flexWrap: "nowrap",
  },
  priceItem: { minWidth: 120, textAlign: "right" },
  priceLabel: { fontSize: 12, color: "#666", fontWeight: 700 },
  priceValue: { fontSize: 14, fontWeight: 700 },

  // Totales
  totalWrap: { marginTop: 8, paddingTop: 8, borderTop: "1px solid #E5E5E5" },
  totalText: {
    textAlign: "right",
    fontWeight: 700,
    fontSize: 15,
    marginTop: 4,
    lineHeight: 1.2,
  },

  // Acciones
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

  // Overlay éxito
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

  // ─────────────────── Generar PDF ───────────────────
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
          } catch (err) {
            console.error("Error al convertir imagen:", err);
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

  // ─────────────────── Render ───────────────────
  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Overlay de éxito */}
      {pdfStatus === "success" && (
        <div style={styles.overlaySuccess}>
          <div style={styles.successBox}>✅ PDF generado con éxito</div>
        </div>
      )}

      <div ref={ref} style={styles.page}>
        {/* ───── Header Moderno ───── */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            {empresa.logo && (
              <img src={empresa.logo} alt="Logo" style={styles.logo} />
            )}
            <div>
              <div style={styles.empresaNombre}>{empresa.nombre}</div>
              {empresa.ruc && <div style={styles.empresaDato}>{empresa.ruc}</div>}
              {empresa.direccion && (
                <div style={styles.empresaDato}>{empresa.direccion}</div>
              )}
              {empresa.telefono && (
                <div style={styles.empresaDato}>{empresa.telefono}</div>
              )}
              {empresa.correo && (
                <div style={styles.empresaDato}>{empresa.correo}</div>
              )}
              {empresa.web && <div style={styles.empresaDato}>{empresa.web}</div>}
            </div>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.proformaTitle}>PROFORMA</div>
            <div style={styles.proformaNumber}>N°: {numeroParaMostrar}</div>
            {cliente.fecha && (
              <div style={styles.proformaDate}>{cliente.fecha}</div>
            )}
          </div>
        </div>

        {/* ───── Cliente ───── */}
        <div style={styles.clienteBox}>
          <div style={styles.clienteLabel}>Cliente</div>
          {cliente.nombre && (
            <div style={styles.clienteDato}>👤 {cliente.nombre}</div>
          )}
          {cliente.ruc && (
            <div style={styles.clienteDato}>🆔 {cliente.ruc}</div>
          )}
          {cliente.direccion && (
            <div style={styles.clienteDato}>📍 {cliente.direccion}</div>
          )}
        </div>

        {/* ───── Productos ───── */}
        <div style={styles.productosWrap}>
          {productos.map((p, idx) => {
            const precio = Number(p.precio) || 0;
            const cantidad = Number(p.cantidad) || 0;
            const importe = precio * cantidad;
            const tieneImagen =
              p.imagenForPdf || p.imagenPreview || p.imagenFile || p.imagen;

            return (
              <div
                key={idx}
                style={{
                  ...styles.productoRow,
                  ...(idx > 0 ? styles.productoSeparator : {}),
                }}
              >
                <div style={styles.productoImgLeft}>
                  {tieneImagen && (
                    <img
                      src={
                        p.imagenForPdf ||
                        p.imagenPreview ||
                        p.imagenFile ||
                        p.imagen
                      }
                      alt={p.nombre || "Producto"}
                      style={styles.productoImgTag}
                    />
                  )}
                </div>

                <div style={styles.productoDetails}>
                  <div style={styles.productoName}>{p.nombre}</div>
                  {p.descripcion && (
                    <div style={styles.productoDesc}>{p.descripcion}</div>
                  )}
                  <div style={{ flexGrow: 1 }} />
                  <div style={styles.priceBlock}>
                    <div style={styles.priceItem}>
                      <div style={styles.priceLabel}>Precio</div>
                      <div style={styles.priceValue}>
                        S/ {formatMoney(precio)}
                      </div>
                    </div>
                    <div style={styles.priceItem}>
                      <div style={styles.priceLabel}>Cantidad</div>
                      <div style={styles.priceValue}>{cantidad}</div>
                    </div>
                    <div style={styles.priceItem}>
                      <div style={styles.priceLabel}>Importe</div>
                      <div style={styles.priceValue}>
                        S/ {formatMoney(importe)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ───── Totales ───── */}
        <div style={styles.totalWrap}>
          <div style={styles.totalText}>Subtotal: S/ {formatMoney(total)}</div>
          <div style={styles.totalText}>IGV (0%): S/ {formatMoney(0)}</div>
          <div style={styles.totalText}>Total: S/ {formatMoney(total)}</div>
        </div>
      </div>

      {/* ───── Acciones ───── */}
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
