// src/pdf/TotalesPDF.jsx
import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  totalWrap: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
  },
  totalText: {
    textAlign: "right",
    fontSize: 11,
    marginTop: 4,
  },
  totalFinal: {
    textAlign: "right",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 6,
    color: "#000",
  },
});

// Función auxiliar para formatear moneda en PEN
const PEN = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (n) => PEN.format(Number(n) || 0);

const TotalesPDF = ({ subtotal, igv, total }) => (
  <View style={styles.totalWrap}>
    <Text style={styles.totalText}>Subtotal: S/ {formatMoney(subtotal)}</Text>
    <Text style={styles.totalText}>IGV (0%): S/ {formatMoney(igv)}</Text>
    <Text style={styles.totalFinal}>Total: S/ {formatMoney(total)}</Text>
  </View>
);

export default TotalesPDF;
