import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    paddingTop: 6,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },
  label: { fontWeight: "bold", marginBottom: 2 },
});

export default function ClientePDF({ cliente }) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}></Text>
      {cliente.nombre && <Text>{cliente.nombre}</Text>}
      {cliente.ruc && <Text>{cliente.ruc}</Text>}
      {cliente.direccion && <Text>{cliente.direccion}</Text>}
    </View>
  );
}
