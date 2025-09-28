// src/Proforma/Footer.jsx
import React from "react";

export default function Footer({ empresa }) {
  const styles = {
    footer: {
      marginTop: 16,
      paddingTop: 10,
      fontSize: 11,
      color: "#555",
      lineHeight: 1.3,
      textAlign: "center",
      borderTop: "2px solid #D0D0D0",
    },
  };

  return (
    <div style={styles.footer}>
      Gracias por confiar en <strong>{empresa.nombre || "nuestra empresa"}</strong>.  
      Ofrecemos productos de calidad y un servicio ágil.
    </div>
  );
}
