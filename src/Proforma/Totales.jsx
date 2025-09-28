// src/Proforma/Totales.jsx
import React from "react";

export default function Totales({ total, formatMoney }) {
  const styles = {
    wrap: {
      marginTop: 8,
      paddingTop: 8,
      borderTop: "1px solid #E5E5E5",
      textAlign: "right",
      lineHeight: 1.2, // 🔹 menos espacio entre líneas
    },
    row: {
      fontSize: 14,
      fontWeight: 500,
      color: "#333",
      marginTop: 2, // 🔹 espacio reducido
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
      marginTop: 4, // un poco más para que destaque
    },
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.row}>
        Subtotal: S/ {formatMoney(total)}
      </div>
      <div style={styles.igv}>
        IGV (0%): S/ {formatMoney(0)}
      </div>
      <div style={styles.total}>
        Total: S/ {formatMoney(total)}
      </div>
    </div>
  );
}
