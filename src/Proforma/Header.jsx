// src/Proforma/Header.jsx
import React from "react";

export default function Header({ empresa, titulo = "PROFORMA", numero, fecha }) {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      backgroundColor: "#2563eb", // azul corporativo
      color: "#fff",
      padding: "16px 24px",
      borderRadius: 4,
    },
    left: {
      fontWeight: 700,
      fontSize: 30,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    right: {
      textAlign: "right",
    },
    titulo: {
      fontWeight: 700,
      fontSize: 18,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    numero: {
      fontSize: 13,
      fontWeight: 600,
    },
    fecha: {
      fontSize: 12,
      opacity: 0.9,
    },
  };

  return (
    <div style={styles.container}>
      {/* Nombre de la empresa */}
      <div style={styles.left}>{empresa?.nombre || "NOMBRE DE EMPRESA"}</div>

      {/* Título, número y fecha */}
      <div style={styles.right}>
        <div style={styles.titulo}>{titulo}</div>
        {numero && <div style={styles.numero}>N°: {numero}</div>}
        {fecha && <div style={styles.fecha}>{fecha}</div>}
      </div>
    </div>
  );
}
