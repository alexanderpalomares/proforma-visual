// src/Proforma/Header.jsx
import React from "react";

export default function Header({ empresa, titulo = "PROFORMA", numero, fecha }) {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      backgroundColor: "#f3f4f6", // gris muy claro (neutral)
      color: "#111", // 👈 texto oscuro
      padding: "16px 24px",
      borderRadius: 4,
      border: "1px solid #e5e7eb", // borde sutil para dar estructura
    },
    left: {
      fontWeight: 700,
      fontSize: 20,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    right: {
      textAlign: "right",
    },
    titulo: {
      fontWeight: 700,
      fontSize: 18,
      marginBottom: 4,
    },
    numero: {
      fontSize: 13,
      fontWeight: 600,
      color: "#374151", // gris medio
      marginBottom: 2,
    },
    fecha: {
      fontSize: 12,
      color: "#6b7280", // gris más suave
    },
  };

  return (
    <div style={styles.container}>
      {/* Empresa */}
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
