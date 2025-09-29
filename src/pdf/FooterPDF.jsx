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
  },
  col: { width: "32%" },
  title: { fontSize: 10, fontWeight: "bold", marginBottom: 4 },
  text: { fontSize: 9, color: "#333", marginBottom: 2 },
  gracias: { textAlign: "center", marginTop: 12, fontSize: 9 },
});

export default function FooterPDF({ observaciones, banco, empresa }) {
  return (
    <>
      <View style={styles.footer}>
        <View style={styles.col}>
          <Text style={styles.title}>Observaciones:</Text>
          <Text style={styles.text}>{observaciones || "—"}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.title}>Datos Bancarios:</Text>
          {banco?.cuenta && <Text style={styles.text}>Cuenta: {banco.cuenta}</Text>}
          {banco?.cci && <Text style={styles.text}>CCI: {banco.cci}</Text>}
          {banco?.titular && <Text style={styles.text}>Titular: {banco.titular}</Text>}
        </View>
        <View style={styles.col}>
          <Text style={styles.title}>Términos y Condiciones:</Text>
          <Text style={styles.text}>- Los precios son válidos por 7 días.</Text>
          <Text style={styles.text}>- La garantía aplica solo a defectos de fábrica.</Text>
          <Text style={styles.text}>- No se aceptan devoluciones sin comprobante.</Text>
        </View>
      </View>
      <Text style={styles.gracias}>Gracias por confiar en {empresa.nombre}.</Text>
    </>
  );
}
