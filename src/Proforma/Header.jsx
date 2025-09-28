// src/Proforma/Header.jsx
import React from "react";

export default function Header({ empresa, numero, fecha }) {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingBottom: 16,
      marginBottom: 20,
      borderBottom: "2px solid #E5E5E5",
    },
    left: {
      fontWeight: 700,
      fontSize: 20,
      textTransform: "uppercase",
      color: "#111",
      letterSpacing: "0.5px",
    },
    right: {
      textAlign: "right",
    },
    proformaTitle: {
      fontSize: 20,
      fontWeight: 700,
      fontFamily: "Poppins, sans-serif",
      marginBottom: 4,
      color: "#111",
    },
    proformaNumber: {
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 2,
      color: "#2563eb", // azul corporativo, puedes cambiarlo
    },
    proformaFecha: {
      fontSize: 12,
      color: "#666",
    },
  };

  return (
    <div style={styles.container}>
      {/* Empresa emisora */}
      <div style={styles.left}>{empresa?.nombre || "NOMBRE DE EMPRESA"}</div>

      {/* Proforma info */}
      <div style={styles.right}>
        <div style={styles.proformaTitle}>PROFORMA</div>
        {numero && <div style={styles.proformaNumber}>N°: {numero}</div>}
        {fecha && <div style={styles.proformaFecha}>{fecha}</div>}
      </div>
    </div>
  );
}
