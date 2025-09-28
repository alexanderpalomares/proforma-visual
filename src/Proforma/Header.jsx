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
      width: 70, // 🔑 ancho fijo
      height: 70, // 🔑 alto fijo
      borderRadius: 10,
      border: "1px solid #E5E5E5",
      background: "#fafafa",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      flexShrink: 0, // evita que se deforme si el contenedor se hace chico
    },
    logo: {
      width: "100%",
      height: "100%",
      objectFit: "contain", // mantiene proporción del logo
    },
    textGroup: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      lineHeight: 1,
    },
    empresaNombre: {
      fontWeight: 700,
      fontSize: 14,
      marginBottom: 1,
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
        <div style={styles.logoBox}>
          {empresa?.logo ? (
            <img src={empresa.logo} alt="Logo" style={styles.logo} />
          ) : (
            <span style={{ fontSize: 10, color: "#999" }}>Logo</span>
          )}
        </div>

        <div style={styles.textGroup}>
          <div style={styles.empresaNombre}>
            {empresa?.nombre || "Nombre de la empresa"}
          </div>
          <div style={styles.empresaDato}>{empresa?.ruc || "---"}</div>
          <div style={styles.empresaDato}>
            {empresa?.direccion || "Dirección no registrada"}
          </div>
          <div style={styles.empresaDato}>{empresa?.telefono || "—"}</div>
          <div style={styles.empresaDato}>{empresa?.correo || "—"}</div>
          <div style={styles.empresaDato}>{empresa?.web || "—"}</div>
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
