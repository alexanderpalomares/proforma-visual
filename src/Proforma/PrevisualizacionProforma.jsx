import React, { useMemo, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ProformaPDF from "../pdf/ProformaPDF";
import { peekNextProformaNumber, getNextProformaNumber } from "../utils/numeracionProforma";

const PEN = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (n) => PEN.format(Number(n) || 0);

// ─────────────────── Estilos ESPEJO del PDF (ProformaPDF.jsx) ───────────────────
const styles = {
  page: {
    width: 794,
    margin: "0 auto",
    padding: 24,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#000",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 10,
    borderBottom: "1px solid #D9D9D9",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: { width: 87, height: 87, marginRight: 5 },
  headerTextGroup: { color: "#000" },
  empresaNombre: { fontWeight: 700, fontSize: 12.5 },
  empresaDato: { fontSize: 12.5, lineHeight: 1.2 },
  proformaBlock: { textAlign: "right" },
  proformaTitle: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "Poppins",
  },
  proformaNumber: { fontSize: 13, marginTop: 2 },
  proformaFecha: { fontSize: 13, color: "#000" },
  clienteSection: {
    paddingTop: 6,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottom: "1px solid #E5E5E5",
    lineHeight: 1.2,
  },
  clienteLabel: { fontWeight: 700, fontSize: 12.5, marginBottom: 2 },
  clienteItem: { fontSize: 12.5, margin: "1px 0" },
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
  productoImgTag: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
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
  grow: { flexGrow: 1 },
  priceBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
    width: "100%",
    flexWrap: "nowrap",
  },
  priceItem: {
    minWidth: 120,
    textAlign: "right",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: 700,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 700,
  },
  totalWrap: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid #E5E5E5",
  },
  totalText: {
    textAlign: "right",
    fontWeight: 700,
    fontSize: 15,
    marginTop: 4,
    lineHeight: 1.2,
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    fontSize: 9,
    color: "#555",
    lineHeight: 1.3,
    textAlign: "justify",
    borderTop: "2px solid #D0D0D0",
  },
  actions: {
    display: "flex",
    justifyContent: "end",
    gap: 8,
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

      <div ref={ref} style={{ ...styles.page, textAlign: "left" }}>
        <div style={styles.headerContainer}>
          <div style={styles.headerLeft}>
            {empresa.logo && <img src={empresa.logo} alt="Logo" style={styles.logo} />}
            <div style={styles.headerTextGroup}>
              <div style={styles.empresaNombre}>{empresa.nombre}</div>
              <div style={styles.empresaDato}>RUC: {empresa.ruc}</div>
              <div style={styles.empresaDato}>{empresa.direccion}</div>
              {empresa.telefono && <div style={styles.empresaDato}>Tel: {empresa.telefono}</div>}
              {empresa.correo && <div style={styles.empresaDato}>{empresa.correo}</div>}
              {empresa.instagram && (
                <div style={styles.empresaDato}>Instagram: {empresa.instagram}</div>
              )}
            </div>
          </div>

          <div style={styles.proformaBlock}>
            <div style={styles.proformaTitle}>PROFORMA</div>
            <div style={styles.proformaNumber}>N°: {numeroParaMostrar}</div>
            {cliente.fecha && <div style={styles.proformaFecha}>Fecha: {cliente.fecha}</div>}
          </div>
        </div>

        <div style={styles.clienteSection}>
          <div style={styles.clienteLabel}>Datos del Cliente</div>
          {cliente.nombre && <div style={styles.clienteItem}>Nombre: {cliente.nombre}</div>}
          {cliente.ruc && <div style={styles.clienteItem}>RUC: {cliente.ruc}</div>}
          {cliente.direccion && <div style={styles.clienteItem}>Dirección: {cliente.direccion}</div>}
        </div>

        <div style={styles.productosWrap}>
          {productos.map((p, idx) => {
            const precio = Number(p.precio) || 0;
            const cantidad = Number(p.cantidad) || 0;
            const importe = precio * cantidad;
            const tieneImagen = p.imagenForPdf || p.imagenPreview || p.imagenFile || p.imagen;

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
                      src={p.imagenForPdf || p.imagenPreview || p.imagenFile || p.imagen}
                      alt={p.nombre || "Producto"}
                      style={styles.productoImgTag}
                    />
                  )}
                </div>

                <div style={styles.productoDetails}>
                  <div style={styles.productoName}>{p.nombre}</div>
                  {p.descripcion && <div style={styles.productoDesc}>{p.descripcion}</div>}

                  <div style={styles.grow} />

                  <div style={styles.priceBlock}>
                    <div style={styles.priceItem}>
                      <div style={styles.priceLabel}>Precio</div>
                      <div style={styles.priceValue}>S/ {formatMoney(precio)}</div>
                    </div>
                    <div style={styles.priceItem}>
                      <div style={styles.priceLabel}>Cantidad</div>
                      <div style={styles.priceValue}>{cantidad}</div>
                    </div>
                    <div style={styles.priceItem}>
                      <div style={styles.priceLabel}>Importe</div>
                      <div style={styles.priceValue}>S/ {formatMoney(importe)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.totalWrap}>
          <div style={styles.totalText}>Subtotal: S/ {formatMoney(total)}</div>
          <div style={styles.totalText}>IGV (0%): S/ {formatMoney(0)}</div>
          <div style={styles.totalText}>Total: S/ {formatMoney(total)}</div>
        </div>

        <div style={styles.footer}>
          <p>
            <strong>Condiciones:</strong> Precios en soles e IGV incluido (salvo indicación
            contraria). Validez de la proforma: 7 días. Entrega sujeta a stock. Plazo de
            entrega típico: 24–48 horas.
          </p>
          <p>
            <strong>Pago:</strong> Transferencia o depósito. BCP Soles: 123-456789-0-12 — A
            nombre de {empresa?.nombre || "Bicicentro Carlitos"}.
          </p>
          <p>Esta es una proforma informativa, no constituye comprobante de pago.</p>
          <p>
            * Venta sujeta a exoneración de IGV según Ley de la Amazonía (D.S. N.º 055-99-EF).
          </p>
        </div>
      </div>

      <div className="print:hidden" style={{ ...styles.actions, justifyContent: "center", marginTop: 16 }}>
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
