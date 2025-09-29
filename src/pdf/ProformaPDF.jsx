import React from "react";
import { Page, Document, StyleSheet, Font } from "@react-pdf/renderer";

import HeaderPDF from "./HeaderPDF";
import ClientePDF from "./ClientePDF";
import ProductoRowPDF from "./ProductoRowPDF";
import TotalesPDF from "./TotalesPDF";
import FooterPDF from "./FooterPDF";

// Registrar Poppins
Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
});

const ProformaPDF = ({ empresa, cliente, productos, numeroProforma, observaciones, banco }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <HeaderPDF empresa={empresa} numeroProforma={numeroProforma} fecha={cliente.fecha} />
        <ClientePDF cliente={cliente} />
        {productos.map((p, idx) => (
          <ProductoRowPDF key={idx} producto={p} idx={idx} />
        ))}
        <TotalesPDF productos={productos} />
        <FooterPDF observaciones={observaciones} banco={banco} empresa={empresa} />
      </Page>
    </Document>
  );
};

export default ProformaPDF;
