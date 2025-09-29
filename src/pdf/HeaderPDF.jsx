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

  // Bloque empresa
  empresaBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 40,        // más compacto que antes
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#fafafa",
    marginRight: 8,
    overflow: "hidden",
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  headerTextGroup: {
    flexDirection: "column",
    justifyContent: "center",
    lineHeight: 1.1,
  },
  empresaNombre: {
    fontFamily: "Poppins",
    fontSize: 11,     // ajustado
    fontWeight: "bold",
    marginBottom: 2,
    lineHeight: 1.1,
  },
  empresaDato: {
    fontSize: 9,      // más pequeño
    color: "#333",
    lineHeight: 1.1,  // menos espacio entre líneas
  },

  // Bloque documento
  proformaBlock: {
    textAlign: "right",
  },
  proformaTitle: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  proformaNumber: {
    fontSize: 10,
    marginTop: 2,
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
            <Text style={{ fontSize: 7, color: "#999" }}>Logo</Text>
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

      {/* Bloque documento */}
      <View style={styles.proformaBlock}>
        <Text style={styles.proformaTitle}>PROFORMA</Text>
        {numeroProforma && <Text style={styles.proformaNumber}>N°: {numeroProforma}</Text>}
        {fecha && <Text style={{ fontSize: 9 }}>{fecha}</Text>}
      </View>
    </View>
  );
}
