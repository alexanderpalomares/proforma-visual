// src/Proforma/Header.jsx
import React from "react";

export default function Header({ empresa, numero, fecha, tipoDocumento }) {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      marginBottom: 10,
      borderBottom: "1px solid #D9D9D9",
    },
    empresaBlock: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    logo: {
      height: "100%",
      maxHeight: 60,
      aspectRatio: "1/1",
      objectFit: "contain",
      borderRadius: 10,
    },
    textGroup: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      lineHeight: 1.1,
    },
    empresaNombre: {
      fontWeight: 800,
      fontSize: 14,
      marginBottom: 2,
    },
    empresaDato: {
      fontSize: 11,
      color: "#333",
    },
    right: {
      textAlign: "right",
      lineHeight: 1.1,
    },
    docTitle: {
      fontSize: 14,
      fontWeight: 800,
      marginBottom: 2,
      textTransform: "uppercase",
    },
    docNumber: {
      fontSize: 11,
      fontWeight: 600,
      marginBottom: 2,
    },
    docFecha: {
      fontSize: 11,
      color: "#333",
    },
  };

  return (
    <div style={styles.container}>
      {/* Bloque empresa */}
      <div style={styles.empresaBlock}>
        {empresa.logo && <img src={empresa.logo} alt="Logo" style={styles.logo} />}
        <div style={styles.textGroup}>
          <div style={styles.empresaNombre}>{empresa.nombre}</div>
          {empresa.ruc && <div style={styles.empresaDato}>{empresa.ruc}</div>}
          {empresa.direccion && <div style={styles.empresaDato}>{empresa.direccion}</div>}
          {empresa.correo && <div style={styles.empresaDato}>{empresa.correo}</div>}
          {empresa.web && <div style={styles.empresaDato}>{empresa.web}</div>}
        </div>
      </div>

      {/* Bloque documento */}
      <div style={styles.right}>
        <div style={styles.docTitle}>{tipoDocumento}</div>
        {numero && <div style={styles.docNumber}>N°: {numero}</div>}
        {fecha && <div style={styles.docFecha}>{fecha}</div>}
      </div>
    </div>
  );
}
