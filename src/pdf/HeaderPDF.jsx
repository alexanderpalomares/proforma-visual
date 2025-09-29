import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#D9D9D9",
  },

  empresaBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 70,      // igual que en previsualización
    height: 70,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  textGroup: {
    flexDirection: "column",
    justifyContent: "center",
    lineHeight: 1.1,
  },
  empresaNombre: {
    fontFamily: "Poppins",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
    lineHeight: 1.1,
  },
  empresaDato: {
    fontSize: 11,
    color: "#333",
    lineHeight: 1.1,
  },

  right: {
    textAlign: "right",
    lineHeight: 1.1,
  },
  docTitle: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Poppins",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  docNumber: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  docFecha: {
    fontSize: 11,
    color: "#333",
  },
});

export default function HeaderPDF({ empresa, numeroProforma, fecha }) {
  return (
    <View style={styles.container}>
      {/* Bloque empresa */}
      <View style={styles.empresaBlock}>
        <View style={styles.logoBox}>
          {empresa.logo ? (
            <Image src={empresa.logo} style={styles.logo} />
          ) : (
            <Text style={{ fontSize: 8, color: "#999" }}>Logo</Text>
          )}
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.empresaNombre}>{empresa.nombre}</Text>
          {empresa.ruc && <Text style={styles.empresaDato}>{empresa.ruc}</Text>}
          {empresa.direccion && <Text style={styles.empresaDato}>{empresa.direccion}</Text>}
          {empresa.telefono && <Text style={styles.empresaDato}>{empresa.telefono}</Text>}
          {empresa.correo && <Text style={styles.empresaDato}>{empresa.correo}</Text>}
          {empresa.web && <Text style={styles.empresaDato}>{empresa.web}</Text>}
        </View>
      </View>

      {/* Bloque documento */}
      <View style={styles.right}>
        <Text style={styles.docTitle}>PROFORMA</Text>
        {numeroProforma && <Text style={styles.docNumber}>N°: {numeroProforma}</Text>}
        {fecha && <Text style={styles.docFecha}>{fecha}</Text>}
      </View>
    </View>
  );
}
