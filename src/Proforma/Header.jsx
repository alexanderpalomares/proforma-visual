// src/Proforma/Header.jsx
import React from "react";

export default function Header({ empresa, numero, fecha, cliente }) {
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
      display: "flex",
      flexDirection: "column",
      gap: 2,
      color: "#000",
    },
    clienteNombre: {
      fontWeight: 700,
      fontSize: 18,
      textTransform: "uppercase",
    },
    clienteDato: {
      fontSize: 12,
      lineHeight: 1.4,
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
      {/* Datos del cliente */}
      <div style={styles.left}>
        {cliente?.nombre && <div style={styles.clienteNombre}>{cliente.nombre}</div>}
        {cliente?.ruc && <div style={styles.clienteDato}>{cliente.ruc}</div>}
        {cliente?.direccion && <div style={styles.clienteDato}>{cliente.direccion}</div>}
      </div>

      {/* Datos de la proforma */}
      <div style={styles.right}>
        <div style={styles.proformaTitle}>PROFORMA</div>
        <div style={styles.proformaNumber}>N°: {numero}</div>
        {fecha && <div style={styles.proformaFecha}>{fecha}</div>}
      </div>
    </div>
  );
}
