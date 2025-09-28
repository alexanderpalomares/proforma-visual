// src/Proforma/ClienteInfo.jsx
import React from "react";

export default function ClienteInfo({ cliente }) {
  const styles = {
    section: {
      paddingTop: 4,
      paddingBottom: 6,
      marginBottom: 6,
      borderBottom: "1px solid #E5E5E5",
      lineHeight: 1, // compacto
    },
    item: {
      fontSize: 11,     // tamaño uniforme y discreto
      fontWeight: 400,  // sin resaltar
      margin: "1px 0",  // separación mínima
      color: "#333",    // gris oscuro
    },
  };

  return (
    <div style={styles.section}>
      {cliente.nombre && <div style={styles.item}>Nombre: {cliente.nombre}</div>}
      {cliente.ruc && <div style={styles.item}>RUC: {cliente.ruc}</div>}
      {cliente.direccion && <div style={styles.item}>Dirección: {cliente.direccion}</div>}
    </div>
  );
}
