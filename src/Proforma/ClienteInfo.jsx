import React from "react";

const styles = {
  clienteSection: {
    paddingTop: 6,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottom: "1px solid #E5E5E5",
    lineHeight: 1.2,
  },
  clienteLabel: { fontWeight: 700, fontSize: 12.5, marginBottom: 2 },
  clienteItem: { fontSize: 12.5, margin: "1px 0" },
};

export default function ClienteInfo({ cliente }) {
  return (
    <div style={styles.clienteSection}>
      <div style={styles.clienteLabel}>Cliente</div>
      {cliente.nombre && <div style={styles.clienteItem}>Nombre: {cliente.nombre}</div>}
      {cliente.ruc && <div style={styles.clienteItem}>RUC: {cliente.ruc}</div>}
      {cliente.direccion && <div style={styles.clienteItem}>Dirección: {cliente.direccion}</div>}
    </div>
  );
}
