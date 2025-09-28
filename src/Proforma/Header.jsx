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
      border: "1px solid #E5E5E5",
      background: "#fafafa",
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
      lineHeight: 1.2,
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
        {empresa?.logo ? (
          <img src={empresa.logo} alt="Logo" style={styles.logo} />
        ) : (
          <div style={{ ...styles.logo, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#999" }}>
            Logo
          </div>
        )}

        <div style={styles.textGroup}>
          <div style={styles.empresaNombre}>
            {empresa?.nombre || "Nombre de la empresa"}
          </div>
          <div style={styles.empresaDato}>
            RUC: {empresa?.ruc || "---"}
          </div>
          <div style={styles.empresaDato}>
            {empresa?.direccion || "Dirección no registrada"}
          </div>
          <div style={styles.empresaDato}>
            Tel: {empresa?.telefono || "—"}
          </div>
          <div style={styles.empresaDato}>
            Correo: {empresa?.correo || "—"}
          </div>
          <div style={styles.empresaDato}>
            IG: {empresa?.instagram || "—"}
          </div>
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
