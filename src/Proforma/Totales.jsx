// src/Proforma/Totales.jsx
import React from "react";

export default function Totales({ total, formatMoney }) {
  const styles = {
    wrap: {
      marginTop: 8,
      paddingTop: 8,
      borderTop: "1px solid #E5E5E5",
      textAlign: "right",
    },
    text: { fontWeight: 700, fontSize: 14, marginTop: 2 },
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.text}>Subtotal: S/ {formatMoney(total)}</div>
      <div style={styles.text}>IGV (0%): S/ {formatMoney(0)}</div>
      <div style={styles.text}>Total: S/ {formatMoney(total)}</div>
    </div>
  );
}
