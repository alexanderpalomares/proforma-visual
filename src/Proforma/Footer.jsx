// src/Proforma/Footer.jsx
import React from "react";

export default function Footer() {
  const styles = {
    wrap: {
      marginTop: 20,
      paddingTop: 10,
      borderTop: "1px solid #E5E5E5",
      fontSize: 11,
      color: "#444",
      lineHeight: 1.4,
    },
    section: {
      marginTop: 6,
    },
    title: {
      fontWeight: 600,
      marginBottom: 2,
      color: "#000",
    },
    text: {
      margin: 0,
    },
  };

  return (
    <div style={styles.wrap}>
      {/* Observaciones */}
      <div style={styles.section}>
        <div style={styles.title}>Observaciones:</div>
        <p style={styles.text}>
          Los precios incluyen entrega en almacén principal. Plazo de entrega sujeto a stock disponible.
        </p>
      </div>

      {/* Términos y Condiciones */}
      <div style={styles.section}>
        <div style={styles.title}>Términos y Condiciones:</div>
        <p style={styles.text}>
          - Los precios son válidos por 7 días. <br />
          - La garantía aplica solo a defectos de fábrica. <br />
          - No se aceptan devoluciones sin comprobante de pago.
        </p>
      </div>

      {/* Datos Bancarios */}
      <div style={styles.section}>
        <div style={styles.title}>Datos Bancarios:</div>
        <p style={styles.text}>
          Banco BCP – Cuenta Corriente: 123-4567890-0-11 <br />
          CCI: 00212300456789001199 <br />
          Titular: Proveedores del Oriente E.I.R.L.
        </p>
      </div>

      {/* Mensaje final */}
      <div style={styles.section}>
        <p style={styles.text}>
          Gracias por confiar en <strong>Kike Ferretería</strong>. Ofrecemos productos de calidad y un servicio ágil.
        </p>
      </div>
    </div>
  );
}
