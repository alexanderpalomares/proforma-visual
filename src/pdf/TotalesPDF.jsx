import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const PEN = new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatMoney = (n) => PEN.format(Number(n) || 0);

const styles = StyleSheet.create({
  wrap: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderColor: "#E5E5E5" },
  text: { textAlign: "right", fontWeight: "bold", fontSize: 12, marginTop: 4 },
});

export default function TotalesPDF({ productos }) {
  const total = productos.reduce((acc, p) => acc + ((+p.precio || 0) * (+p.cantidad || 0)), 0);
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>Subtotal: S/ {formatMoney(total)}</Text>
      <Text style={styles.text}>IGV (0%): S/ {formatMoney(0)}</Text>
      <Text style={styles.text}>Total: S/ {formatMoney(total)}</Text>
    </View>
  );
}
