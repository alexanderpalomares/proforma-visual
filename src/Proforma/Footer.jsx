import React from "react";

export default function Footer({ empresa = {}, observaciones = "", banco = {} }) {
  const styles = {
    wrap: {
      marginTop: 20,
      paddingTop: 12,
      borderTop: "1px solid #E5E5E5",
      fontSize: 11,
      color: "#444",
    },
    columns: {
      display: "flex",
      justifyContent: "space-between",
      gap: 20,
      textAlign: "left",
      flexWrap: "wrap", // ✅ responsivo
    },
    col: {
      flex: 1,
      minWidth: 220, // asegura buena visualización en pantallas pequeñas
    },
    title: {
      fontWeight: 600,
      marginBottom: 4,
      color: "#000",
      fontSize: 12,
    },
    text: {
      margin: 0,
      lineHeight: 1.4,
    },
    final: {
      marginTop: 12,
      textAlign: "center",
      fontSize: 11,
      color: "#333",
    },
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.columns}>
        {/* Observaciones */}
        <div style={styles.col}>
          <div style={styles.title}>Observaciones:</div>
          <p style={styles.text}>
            {observaciones && observaciones.trim() !== ""
              ? observaciones
              : "Sin observaciones"}
          </p>
        </div>

        {/* Datos Bancarios */}
        <div style={styles.col}>
          <div style={styles.title}>Datos Bancarios:</div>
          {banco?.cuenta && <p style={styles.text}>Cuenta: {banco.cuenta}</p>}
          {banco?.cci && <p style={styles.text}>CCI: {banco.cci}</p>}
          {banco?.titular && <p style={styles.text}>Titular: {banco.titular}</p>}
          {!banco?.cuenta && !banco?.cci && !banco?.titular && (
            <p style={styles.text}>No se registraron datos bancarios</p>
          )}
        </div>

        {/* Términos y Condiciones */}
        <div style={styles.col}>
          <div style={styles.title}>Términos y Condiciones:</div>
          <p style={styles.text}>- Los precios son válidos por 7 días.</p>
          <p style={styles.text}>- La garantía aplica solo a defectos de fábrica.</p>
          <p style={styles.text}>- No se aceptan devoluciones sin comprobante.</p>
        </div>
      </div>

      {/* Mensaje final */}
      <div style={styles.final}>
        Gracias por confiar en <strong>{empresa?.nombre || "Nuestra empresa"}</strong>.
      </div>
    </div>
  );
}
