// src/Proforma/PrevisualizacionProforma.jsx
import React, { useMemo, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ProformaPDF from "../pdf/ProformaPDF";
import { peekNextProformaNumber, getNextProformaNumber } from "../utils/numeracionProforma";

// Formato moneda
const PEN = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (n) => PEN.format(Number(n) || 0);

// ─────────────────── Estilos refactorizados ───────────────────
const headerStyles = {
  container: {
    backgroundColor: "#facc15", // amarillo
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderRadius: "12px 12px 0 0",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "Poppins, sans-serif",
  },
  number: {
    fontSize: 13,
    marginTop: 2,
  },
};

const clienteStyles = {
  container: {
    padding: "16px 24px",
    borderBottom: "1px solid #e5e7eb",
    lineHeight: 1.3,
  },
  label: { fontWeight: 700, fontSize: 13, marginBottom: 6 },
  item: { fontSize: 13, margin: "2px 0" },
};

const productoStyles = {
  wrap: { display: "flex", flexDirection: "column" },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  imgBox: {
    width: 180,
    height: 140,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  details: { flex: 1, textAlign: "right" },
  name: {
    fontWeight: 700,
    fontSize: 16,
    textTransform: "uppercase",
    marginBottom: 6,
    fontFamily: "Poppins, sans-serif",
  },
  desc: { fontSize: 13, color: "#374151", marginBottom: 8 },
  prices: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 24,
    marginTop: 8,
  },
  priceItem: { minWidth: 100 },
  priceLabel: { fontSize: 12, color: "#6b7280" },
  priceValue: { fontSize: 14, fontWeight: 600 },
};

const totalesStyles = {
  container: { padding: "16px 24px", textAlign: "right" },
  text: { marginBottom: 4, fontSize: 14 },
  totalBox: {
    backgroundColor: "#facc15",
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: 6,
    fontWeight: 700,
    marginTop: 8,
    fontSize: 15,
  },
};

const footerStyles = {
  container: {
    borderTop: "2px solid #e5e7eb",
    padding: "12px 24px",
    fontSize: "0.8rem",
    color: "#6b7280",
    display: "flex",
    justifyContent: "space-between",
  },
};

const actionsStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
  },
  btn: {
    padding: "10px 20px",
    borderRadius: 8,
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
  },
  green: { backgroundColor: "#16a34a" },
  yellow: { backgroundColor: "#eab308", cursor: "wait" },
  blue: { backgroundColor: "#2563eb" },
  red: { backgroundColor: "#dc2626" },
  gray: { backgroundColor: "#6b7280" },
};

// ─────────────────── Componente principal ───────────────────
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
          const res = await fetch(src);
          const blob = await res.blob();
          const reader = new FileReader();
          const imagenForPdf = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          return { ...p, imagenForPdf };
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
      ? { ...actionsStyles.btn, ...actionsStyles.green }
      : pdfStatus === "loading"
      ? { ...actionsStyles.btn, ...actionsStyles.yellow }
      : pdfStatus === "success"
      ? { ...actionsStyles.btn, ...actionsStyles.blue }
      : { ...actionsStyles.btn, ...actionsStyles.red };

  const numeroParaMostrar = numeroFinal ?? numeroPreview;

  return (
    <div ref={ref} style={{ backgroundColor: "#fff", borderRadius: 12, overflow: "hidden" }}>
      {/* HEADER */}
      <div style={headerStyles.container}>
        <div style={headerStyles.title}>PROFORMA</div>
        <div style={headerStyles.number}>N°: {numeroParaMostrar}</div>
      </div>

      {/* CLIENTE */}
      <div style={clienteStyles.container}>
        <div style={clienteStyles.label}>Cliente</div>
        {cliente.nombre && <div style={clienteStyles.item}>Nombre: {cliente.nombre}</div>}
        {cliente.ruc && <div style={clienteStyles.item}>RUC: {cliente.ruc}</div>}
        {cliente.direccion && <div style={clienteStyles.item}>Dirección: {cliente.direccion}</div>}
        {cliente.fecha && <div style={clienteStyles.item}>Fecha: {cliente.fecha}</div>}
      </div>

      {/* PRODUCTOS */}
      <div style={productoStyles.wrap}>
        {productos.map((p, idx) => {
          const precio = Number(p.precio) || 0;
          const cantidad = Number(p.cantidad) || 0;
          const importe = precio * cantidad;
          const tieneImagen = p.imagenForPdf || p.imagenPreview || p.imagenFile || p.imagen;

          return (
            <div key={idx} style={productoStyles.row}>
              <div style={productoStyles.imgBox}>
                {tieneImagen && (
                  <img
                    src={p.imagenForPdf || p.imagenPreview || p.imagenFile || p.imagen}
                    alt={p.nombre || "Producto"}
                    style={productoStyles.img}
                  />
                )}
              </div>

              <div style={productoStyles.details}>
                <div style={productoStyles.name}>{p.nombre}</div>
                {p.descripcion && <div style={productoStyles.desc}>{p.descripcion}</div>}

                <div style={productoStyles.prices}>
                  <div style={productoStyles.priceItem}>
                    <div style={productoStyles.priceLabel}>Precio</div>
                    <div style={productoStyles.priceValue}>S/ {formatMoney(precio)}</div>
                  </div>
                  <div style={productoStyles.priceItem}>
                    <div style={productoStyles.priceLabel}>Cantidad</div>
                    <div style={productoStyles.priceValue}>{cantidad}</div>
                  </div>
                  <div style={productoStyles.priceItem}>
                    <div style={productoStyles.priceLabel}>Importe</div>
                    <div style={productoStyles.priceValue}>S/ {formatMoney(importe)}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOTALES */}
      <div style={totalesStyles.container}>
        <div style={totalesStyles.text}>Subtotal: S/ {formatMoney(total)}</div>
        <div style={totalesStyles.text}>IGV (0%): S/ {formatMoney(0)}</div>
        <div style={totalesStyles.totalBox}>Total: S/ {formatMoney(total)}</div>
      </div>

      {/* FOOTER */}
      <div style={footerStyles.container}>
        <div>Tel: {empresa.telefono || "987 654 321"}</div>
        <div>{empresa.web || "www.miempresa.com"}</div>
        <div>{empresa.correo || "ventas@miempresa.com"}</div>
      </div>

      {/* BOTONES */}
      <div style={actionsStyles.container}>
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
          style={{ ...actionsStyles.btn, ...actionsStyles.gray }}
        >
          Volver
        </button>
      </div>
    </div>
  );
}
