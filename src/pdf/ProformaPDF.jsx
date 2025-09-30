// src/pdf/ProformaPDF.jsx
import React from "react";
import { Page, Document, StyleSheet, Text } from "@react-pdf/renderer";

// Bloques refactorizados
import HeaderPDF from "./HeaderPDF";
import ClienteInfoPDF from "./ClienteInfoPDF";
import ProductoRowPDF from "./ProductoRowPDF";
import TotalesPDF from "./TotalesPDF";
import FooterPDF from "./FooterPDF";

// ─────────────────── Estilos globales ───────────────────
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  gracias: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 9,
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 24,
    fontSize: 8,
    color: "#666",
  },
});

const ProformaPDF = ({
  empresa,
  cliente,
  productos,
  numeroProforma,
  observaciones,
  banco,
}) => {
  const total = productos.reduce(
    (acc, p) => acc + ((+p.precio || 0) * (+p.cantidad || 0)),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <HeaderPDF empresa={empresa} numeroProforma={numeroProforma} cliente={cliente} />

        {/* CLIENTE */}
        <ClienteInfoPDF cliente={cliente} />

        {/* PRODUCTOS */}
        {productos.map((p, idx) => (
          <ProductoRowPDF key={idx} producto={p} idx={idx} />
        ))}

        {/* TOTALES */}
        <TotalesPDF total={total} />

        {/* FOOTER */}
        <FooterPDF
          empresa={empresa}
          observaciones={observaciones}
          banco={banco}
        />

        {/* Mensaje de gracias */}
        <Text style={styles.gracias}>
          Gracias por confiar en {empresa.nombre}.
        </Text>

        {/* Nº de página */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default ProformaPDF;
