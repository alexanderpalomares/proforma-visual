// src/Proforma/Header.jsx
import React from "react";

export default function Header({ empresa, numero, fecha }) {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingBottom: 10,
      marginBottom: 10,
      borderBottom: "1px solid #E5E5E5",
    },
    left: {
      fontWeight: 700,
      fontSize: 18,
      textTransform: "uppercase",
      color: "#000",
    },
    right: {
      textAlign: "right",
    },
    proformaTitle: {
      fontSize: 16,
      fontWeight: 700,
      fontFamily: "Poppins, sans-serif",
    },
    proformaNumber: {
      fontSize: 12,
      fontWeight: 600,
      marginTop: 2,
    },
    proformaFecha: {
      fontSize: 12,
      color: "#333",
      marginTop: 2,
    },
  };

  return (
    <div style={styles.container}>
      {/* Nombre de la empresa emisora */}
      <div style={styles.left}>{empresa?.nombre || "NOMBRE DE EMPRESA"}</div>

      {/* Bloque de Proforma */}
      <div style={styles.right}>
        <div style={styles.proformaTitle}>PROFORMA</div>
        {numero && <div style={styles.proformaNumber}>N°: {numero}</div>}
        {fecha && <div style={styles.proformaFecha}>{fecha}</div>}
      </div>
    </div>
  );
}
