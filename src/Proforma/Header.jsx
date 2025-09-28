import React from "react";

const styles = {
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 10,
    borderBottom: "1px solid #D9D9D9",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: { width: 87, height: 87, marginRight: 5 },
  headerTextGroup: { color: "#000" },
  empresaNombre: { fontWeight: 700, fontSize: 12.5 },
  empresaDato: { fontSize: 12.5, lineHeight: 1.2 },
  proformaBlock: { textAlign: "right" },
  proformaTitle: { fontSize: 18, fontWeight: 700, fontFamily: "Poppins" },
  proformaNumber: { fontSize: 13, marginTop: 2 },
  proformaFecha: { fontSize: 13, color: "#000" },
};

export default function Header({ empresa, numeroProforma, fecha }) {
  return (
    <div style={styles.headerContainer}>
      <div style={styles.headerLeft}>
        {empresa.logo && <img src={empresa.logo} alt="Logo" style={styles.logo} />}
        <div style={styles.headerTextGroup}>
          <div style={styles.empresaNombre}>{empresa.nombre}</div>
          <div style={styles.empresaDato}>{empresa.ruc}</div>
          <div style={styles.empresaDato}>{empresa.direccion}</div>
          {empresa.telefono && <div style={styles.empresaDato}>Tel: {empresa.telefono}</div>}
          {empresa.correo && <div style={styles.empresaDato}>{empresa.correo}</div>}
          {empresa.web && <div style={styles.empresaDato}>{empresa.web}</div>}
        </div>
      </div>
      <div style={styles.proformaBlock}>
        <div style={styles.proformaTitle}>PROFORMA</div>
        <div style={styles.proformaNumber}>N°: {numeroProforma}</div>
        {fecha && <div style={styles.proformaFecha}>Fecha: {fecha}</div>}
      </div>
    </div>
  );
}
