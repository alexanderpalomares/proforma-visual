// src/Proforma/Footer.jsx
import React from "react";

export default function Footer() {
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
    },
    col: {
      flex: 1,
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
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.columns}>
        {/* Observaciones / Contacto */}
        <div style={styles.col}>
          <div style={styles.title}>Observaciones:</div>
          <p style={styles.text}>La entrega está sujeta a disponibilidad de stock.</p>
          <p style={styles.text}>Consultas: ventas@kikeferreteria.pe</p>
          <p style={styles.text}>Tel: +51 987 654 321</p>
        </div>

        {/* Información de pago */}
        <div style={styles.col}>
          <div style={styles.title}>Datos Bancarios:</div>
          <p style={styles.text}>Cuenta Corriente BCP: 123-4567890-0-11</p>
          <p style={styles.text}>CCI: 00212300456789001199</p>
          <p style={styles.text}>Titular: Proveedores del Oriente E.I.R.L.</p>
        </div>

        {/* Términos y condiciones */}
        <div style={styles.col}>
          <div style={styles.title}>Términos y Condiciones:</div>
          <p style={styles.text}>- Los precios son válidos por 7 días.</p>
          <p style={styles.text}>- Garantía solo aplica a defectos de fábrica.</p>
          <p style={styles.text}>- No se aceptan devoluciones sin comprobante.</p>
        </div>
      </div>
    </div>
  );
}
