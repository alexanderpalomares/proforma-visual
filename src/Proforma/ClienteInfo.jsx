// src/Proforma/ClienteInfo.jsx
import React from "react";

export default function ClienteInfo({ cliente }) {
  const styles = {
    section: {
      paddingTop: 6,
      paddingBottom: 10,
      marginBottom: 2,
      borderBottom: "1px solid #E5E5E5",
    },
    label: { fontWeight: 700, fontSize: 13, marginBottom: 4 },
    item: { fontSize: 12, margin: "2px 0" },
  };

  return (
    <div style={styles.section}>
      <div style={styles.label}></div>
      {cliente.nombre && <div style={styles.item}>Nombre: {cliente.nombre}</div>}
      {cliente.ruc && <div style={styles.item}>RUC: {cliente.ruc}</div>}
      {cliente.direccion && <div style={styles.item}>Dirección: {cliente.direccion}</div>}
    </div>
  );
}
