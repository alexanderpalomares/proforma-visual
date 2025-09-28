// src/Proforma/Header.jsx
import React from "react";

export default function Header({ empresa, numero, fecha }) {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 10,
      marginBottom: 10,
      borderBottom: "1px solid #D9D9D9",
    },
    left: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    logo: { width: 70, height: 70, objectFit: "contain", marginRight: 8 },
    textGroup: { color: "#000" },
    empresaNombre: { fontWeight: 700, fontSize: 14 },
    empresaDato: { fontSize: 12, lineHeight: 1.3 },
    right: { textAlign: "right" },
    title: { fontSize: 18, fontWeight: 700, fontFamily: "Poppins" },
    number: { fontSize: 13, marginTop: 2 },
    fechaText: { fontSize: 13 },
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        {empresa.logo && <img src={empresa.logo} alt="Logo" style={styles.logo} />}
        <div style={styles.textGroup}>
          <div style={styles.empresaNombre}>{empresa.nombre}</div>
          {empresa.ruc && <div style={styles.empresaDato}>{empresa.ruc}</div>}
          {empresa.direccion && <div style={styles.empresaDato}>{empresa.direccion}</div>}
          {empresa.telefono && <div style={styles.empresaDato}>Tel: {empresa.telefono}</div>}
          {empresa.correo && <div style={styles.empresaDato}>{empresa.correo}</div>}
          {empresa.web && <div style={styles.empresaDato}>{empresa.web}</div>}
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.title}>PROFORMA</div>
        <div style={styles.number}>N°: {numero}</div>
        {fecha && <div style={styles.fechaText}>{fecha}</div>}
      </div>
    </div>
  );
}
