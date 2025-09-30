// src/pdf/TotalesPDF.jsx
import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const PEN = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (n) => PEN.format(Number(n) || 0);

const styles = StyleSheet.create({
  totalWrap: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
  },
  totalText: {
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 12,
    marginTop: 4,
  },
});

export default function TotalesPDF({ total }) {
  const subtotal = total;
  const igv = 0.0;

  return (
    <View style={styles.totalWrap}>
      <Text style={styles.totalText}>Subtotal: S/ {formatMoney(subtotal)}</Text>
      <Text style={styles.totalText}>IGV (0%): S/ {formatMoney(igv)}</Text>
      <Text style={styles.totalText}>Total: S/ {formatMoney(total)}</Text>
    </View>
  );
}
