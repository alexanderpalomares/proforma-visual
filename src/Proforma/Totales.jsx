// src/Proforma/Totales.jsx
import React from "react";

export default function Totales({ productos = [], formatMoney }) {
  const styles = {
    wrap: {
      marginTop: 8,
      paddingTop: 8,
      borderTop: "1px solid #E5E5E5",
      textAlign: "right",
      lineHeight: 1.2,
    },
    row: {
      fontSize: 14,
      fontWeight: 500,
      color: "#333",
      marginTop: 2,
    },
    igv: {
      fontSize: 14,
      fontWeight: 400,
      color: "#666",
      marginTop: 2,
    },
    total: {
      fontSize: 15,
      fontWeight: 700,
      color: "#111",
      marginTop: 4,
    },
  };

  // 🧮 Calcular subtotal y total en base a los productos
  const subtotal = productos.reduce((acc, p) => {
    const precio = parseFloat(p.precio) || 0;
    const cantidad = parseFloat(p.cantidad) || 0;
    return acc + precio * cantidad;
  }, 0);

  const igv = 0; // si luego quieres agregar IGV dinámico, aquí es el lugar
  const total = subtotal + igv;

  return (
    <div style={styles.wrap}>
      <div style={styles.row}>
        Subtotal: S/ {formatMoney(subtotal)}
      </div>
      <div style={styles.igv}>
        IGV (0%): S/ {formatMoney(igv)}
      </div>
      <div style={styles.total}>
        Total: S/ {formatMoney(total)}
      </div>
    </div>
  );
}
