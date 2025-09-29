import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#D9D9D9",
  },
  empresaBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#fafafa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  logo: { width: "100%", height: "100%", objectFit: "contain" },
  headerTextGroup: { flexDirection: "column", justifyContent: "center", lineHeight: 1.1 },
  empresaNombre: { fontFamily: "Poppins", fontSize: 12, fontWeight: "bold" },
  empresaDato: { fontSize: 10, color: "#333" },
  proformaBlock: { textAlign: "right" },
  proformaTitle: { fontSize: 14, fontWeight: "bold", fontFamily: "Poppins" },
  proformaNumber: { fontSize: 11, marginTop: 2 },
});

export default function HeaderPDF({ empresa, numeroProforma, fecha }) {
  return (
    <View style={styles.container}>
      <View style={styles.empresaBlock}>
        <View style={styles.logoBox}>
          {empresa.logo ? (
            <Image src={empresa.logo} style={styles.logo} />
          ) : (
            <Text style={{ fontSize: 8, color: "#999" }}>Logo</Text>
          )}
        </View>
        <View style={styles.headerTextGroup}>
          <Text style={styles.empresaNombre}>{empresa.nombre}</Text>
          {empresa.ruc && <Text style={styles.empresaDato}>{empresa.ruc}</Text>}
          {empresa.direccion && <Text style={styles.empresaDato}>{empresa.direccion}</Text>}
          {empresa.telefono && <Text style={styles.empresaDato}>{empresa.telefono}</Text>}
          {empresa.correo && <Text style={styles.empresaDato}>{empresa.correo}</Text>}
          {empresa.web && <Text style={styles.empresaDato}>{empresa.web}</Text>}
        </View>
      </View>
      <View style={styles.proformaBlock}>
        <Text style={styles.proformaTitle}>PROFORMA</Text>
        {numeroProforma && <Text style={styles.proformaNumber}>N°: {numeroProforma}</Text>}
        {fecha && <Text>{fecha}</Text>}
      </View>
    </View>
  );
}
