// src/Proforma/ProductoRow.jsx
import React from "react";

export default function ProductoRow({ producto, idx, formatMoney }) {
  const precio = Number(producto.precio) || 0;
  const cantidad = Number(producto.cantidad) || 0;
  const importe = precio * cantidad;
  const tieneImagen =
    producto.imagenForPdf ||
    producto.imagenPreview ||
    producto.imagenFile ||
    producto.imagen;

  const styles = {
    row: {
      display: "flex",
      flexDirection: "row",
      gap: 12,
      padding: "12px 0",
      borderTop: idx > 0 ? "1px solid #EDEDED" : "none",
    },
    imgWrap: {
      width: 200,
      height: 160,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
    },
    img: { width: "100%", height: "100%", objectFit: "contain" },

    rightContent: {
      display: "flex",
      flex: 1,
      gap: 16,
    },

    textBlock: {
      flex: 1,
      minWidth: 250,
    },
    name: {
      fontWeight: 700,
      fontSize: 16,
      marginBottom: 6,
      textTransform: "uppercase",
    },
    desc: {
      fontSize: 13,
      color: "#444",
      lineHeight: 1.4,
    },

    priceBlock: {
      flex: 1,
      minWidth: 250,
      display: "flex",
      justifyContent: "space-between",
    },
    priceItem: {
      flex: 1,
      textAlign: "center",
    },
    priceLabel: { fontSize: 12, fontWeight: 600, color: "#666" },
    priceValue: { fontSize: 14, fontWeight: 700 },
  };

  return (
    <div style={styles.row}>
      <div style={styles.imgWrap}>
        {tieneImagen && (
          <img
            src={
              producto.imagenForPdf ||
              producto.imagenPreview ||
              producto.imagenFile ||
              producto.imagen
            }
            alt={producto.nombre || "Producto"}
            style={styles.img}
          />
        )}
      </div>

      <div style={styles.rightContent}>
        {/* Bloque de texto */}
        <div style={styles.textBlock}>
          <div style={styles.name}>{producto.nombre}</div>
          {producto.descripcion && (
            <div style={styles.desc}>{producto.descripcion}</div>
          )}
        </div>

        {/* Bloque de precios */}
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
}
