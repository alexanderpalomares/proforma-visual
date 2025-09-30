// src/pdf/ClienteInfoPDF.jsx
import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  clienteSection: {
    paddingTop: 6,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },
  clienteLabel: { fontWeight: "bold", marginBottom: 2 },
  clienteDato: { fontSize: 10, marginBottom: 2 },
});

export default function ClienteInfoPDF({ cliente }) {
  return (
    <View style={styles.clienteSection}>
      <Text style={styles.clienteLabel}>Cliente</Text>
      {cliente.nombre && <Text style={styles.clienteDato}>{cliente.nombre}</Text>}
      {cliente.ruc && <Text style={styles.clienteDato}>RUC: {cliente.ruc}</Text>}
      {cliente.direccion && (
        <Text style={styles.clienteDato}>Dirección: {cliente.direccion}</Text>
      )}
    </View>
  );
}
