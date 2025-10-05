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
    logoBox: {
      width: 70,
      height: 70,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0,
    },
    logo: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
    textGroup: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      lineHeight: 1.2,
    },
    empresaNombre: {
      fontWeight: 700,
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
      fontFamily: "Montserrat, sans-serif",
      fontSize: 28,
      fontWeight: 800,
      marginBottom: 2,
      textTransform: "uppercase",
    },
    docNumber: {
      fontSize: 12,
      fontWeight: 600,
      marginBottom: 2,
    },
    docFecha: {
      fontSize: 12,
      color: "#333",
    },
  };

  return (
    <div style={styles.container}>
      {/* Bloque empresa */}
      <div style={styles.empresaBlock}>
        {empresa?.logo && (
          <div style={styles.logoBox}>
            <img src={empresa.logo} alt="Logo" style={styles.logo} />
          </div>
        )}

        <div style={styles.textGroup}>
          {empresa?.nombre && (
            <div style={styles.empresaNombre}>{empresa.nombre}</div>
          )}
          {empresa?.ruc && (
            <div style={styles.empresaDato}>{empresa.ruc}</div>
          )}
          {empresa?.direccion && (
            <div style={styles.empresaDato}>{empresa.direccion}</div>
          )}
          {empresa?.telefono && (
            <div style={styles.empresaDato}>{empresa.telefono}</div>
          )}
          {empresa?.correo && (
            <div style={styles.empresaDato}>{empresa.correo}</div>
          )}
          {empresa?.web && (
            <div style={styles.empresaDato}>{empresa.web}</div>
          )}
        </div>
      </div>

      {/* Bloque documento */}
      <div style={styles.right}>
        <div style={styles.docTitle}>{tipoDocumento}</div>
        <div style={styles.docNumber}>N°: {numero || "---"}</div>
        <div style={styles.docFecha}>{fecha || "Fecha no registrada"}</div>
      </div>
    </div>
  );
}
