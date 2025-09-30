// src/pdf/FooterPDF.jsx
import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  footerCol: { width: "32%" },
  footerTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  footerText: {
    fontSize: 9,
    color: "#333",
    marginBottom: 2,
  },
  gracias: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 9,
  },
});

const FooterPDF = ({ observaciones, banco, empresa }) => (
  <>
    <View style={styles.footer}>
      {/* Observaciones */}
      <View style={styles.footerCol}>
        <Text style={styles.footerTitle}>Observaciones:</Text>
        <Text style={styles.footerText}>{observaciones || "—"}</Text>
      </View>

      {/* Datos bancarios */}
      <View style={styles.footerCol}>
        <Text style={styles.footerTitle}>Datos Bancarios:</Text>
        {banco?.cuenta && (
          <Text style={styles.footerText}>Cuenta: {banco.cuenta}</Text>
        )}
        {banco?.cci && (
          <Text style={styles.footerText}>CCI: {banco.cci}</Text>
        )}
        {banco?.titular && (
          <Text style={styles.footerText}>Titular: {banco.titular}</Text>
        )}
      </View>

      {/* Términos */}
      <View style={styles.footerCol}>
        <Text style={styles.footerTitle}>Términos y Condiciones:</Text>
        <Text style={styles.footerText}>- Los precios son válidos por 7 días.</Text>
        <Text style={styles.footerText}>- La garantía aplica solo a defectos de fábrica.</Text>
        <Text style={styles.footerText}>- No se aceptan devoluciones sin comprobante.</Text>
      </View>
    </View>

    {/* Mensaje de agradecimiento */}
    <Text style={styles.gracias}>
      Gracias por confiar en {empresa?.nombre}.
    </Text>
  </>
);

export default FooterPDF;
