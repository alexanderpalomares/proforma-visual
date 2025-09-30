// src/pdf/ProformaPDF.jsx
import React from "react";
import { Page, Document, StyleSheet, Text } from "@react-pdf/renderer";

// Bloques refactorizados
import HeaderPDF from "./HeaderPDF";
import ClientePDF from "./ClientePDF";
import ProductoPDF from "./ProductoPDF";
import TotalesPDF from "./TotalesPDF";
import FooterPDF from "./FooterPDF";

// Estilos generales de la página
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
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
  // Cálculo de totales
  const total = productos.reduce(
    (acc, p) => acc + ((+p.precio || 0) * (+p.cantidad || 0)),
    0
  );
  const subtotal = total;
  const igv = 0.0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <HeaderPDF
          empresa={empresa}
          numeroProforma={numeroProforma}
          cliente={cliente}
        />

        {/* CLIENTE */}
        <ClientePDF cliente={cliente} />

        {/* PRODUCTOS */}
        {productos.map((p, idx) => (
          <ProductoPDF key={idx} producto={p} idx={idx} />
        ))}

        {/* TOTALES */}
        <TotalesPDF subtotal={subtotal} igv={igv} total={total} />

        {/* FOOTER */}
        <FooterPDF
          observaciones={observaciones}
          banco={banco}
          empresa={empresa}
        />

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
