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
    row: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      fontSize: 14,
      marginTop: 2,
    },
    label: {
      fontWeight: 500,
      marginRight: 6,
      minWidth: 80, // 🔹 asegura que los ":" queden alineados
      textAlign: "right",
    },
    value: {
      fontWeight: 500,
      minWidth: 90, // 🔹 asegura que los "S/" queden alineados
      textAlign: "left",
    },
    totalRow: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      fontSize: 15,
      marginTop: 4,
      fontWeight: 700,
    },
    totalLabel: {
      marginRight: 6,
      minWidth: 80,
      textAlign: "right",
    },
    totalValue: {
      minWidth: 90,
      textAlign: "left",
      fontWeight: 700,
    },
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.row}>
        <span style={styles.label}>Subtotal:</span>
        <span style={styles.value}>S/ {formatMoney(total)}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>IGV (0%):</span>
        <span style={styles.value}>S/ {formatMoney(0)}</span>
      </div>
      <div style={styles.totalRow}>
        <span style={styles.totalLabel}>Total:</span>
        <span style={styles.totalValue}>S/ {formatMoney(total)}</span>
      </div>
    </div>
  );
}
