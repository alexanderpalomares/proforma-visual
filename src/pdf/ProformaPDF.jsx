// src/pdf/ProformaPDF.jsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Registrar Poppins (para PROFORMA y nombre del producto)
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

const PEN = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (n) => PEN.format(Number(n) || 0);

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#D9D9D9",
  },
  logo: { width: 83, height: 83, marginRight: 12 },
  headerTextGroup: { color: "#000" },
  empresaNombre: { fontWeight: "bold" },
  proformaBlock: { textAlign: "right" },
  proformaTitle: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  proformaNumber: { fontSize: 11, marginTop: 2 },
  clienteSection: {
    paddingTop: 6,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },
  clienteLabel: { fontWeight: "bold" },
  productoRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  productoSeparator: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#EDEDED",
  },
  productoImgLeft: {
    width: 250,
    height: 200,
    objectFit: "contain",
    alignSelf: "center",
  },
  productoDetails: {
    flexDirection: "column",
    alignItems: "flex-end",
    width: 280,
  },
  productoName: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontSize: 13,
    textTransform: "uppercase",
    marginBottom: 4,
    textAlign: "right",
  },
  productoDesc: {
    fontSize: 10,
    textAlign: "right",
    maxWidth: 240,
    alignSelf: "flex-end",
  },
  priceBlock: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  priceItem: { minWidth: 90, alignItems: "flex-end" },
  priceLabel: { fontSize: 9, color: "#666" },
  priceValue: { fontSize: 11, fontWeight: "bold" },
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
  footer: {
    marginTop: 12,
    paddingTop: 10,
    fontSize: 9,
    color: "#555",
    lineHeight: 1.3,
    textAlign: "justify",
    borderTopWidth: 2,
    borderColor: "#D0D0D0",
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    right: 24,
    fontSize: 8,
    color: "#666",
  },
});

const ProformaPDF = ({ empresa, cliente, productos, numeroProforma }) => {
  const total = productos.reduce(
    (acc, p) => acc + ((+p.precio || 0) * (+p.cantidad || 0)),
    0
  );
  const subtotal = total;
  const igv = 0.0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {empresa.logo && <Image src={empresa.logo} style={styles.logo} />}
            <View style={styles.headerTextGroup}>
              <Text style={styles.empresaNombre}>{empresa.nombre}</Text>
              {empresa.ruc && <Text>{empresa.ruc}</Text>}
              {empresa.direccion && <Text>{empresa.direccion}</Text>}
              {empresa.telefono && <Text>Tel: {empresa.telefono}</Text>}
              {empresa.correo && <Text>{empresa.correo}</Text>}
              {empresa.web && <Text>{empresa.web}</Text>}
            </View>
          </View>
          <View style={styles.proformaBlock}>
            <Text style={styles.proformaTitle}>PROFORMA</Text>
            {numeroProforma && (
              <Text style={styles.proformaNumber}>N°: {numeroProforma}</Text>
            )}
            {cliente.fecha && <Text>Fecha: {cliente.fecha}</Text>}
          </View>
        </View>

        {/* Cliente */}
        <View style={styles.clienteSection}>
          <Text style={styles.clienteLabel}>Datos del Cliente</Text>
          {cliente.nombre && <Text>Nombre: {cliente.nombre}</Text>}
          {cliente.ruc && <Text>{cliente.ruc}</Text>}
          {cliente.direccion && <Text>{cliente.direccion}</Text>}
        </View>

        {/* Productos */}
        {productos.map((p, idx) => {
          const precio = Number(p.precio) || 0;
          const cantidad = Number(p.cantidad) || 0;
          const importe = precio * cantidad;

          return (
            <View
              key={idx}
              style={[styles.productoRow, idx > 0 && styles.productoSeparator]}
            >
              {p.imagenForPdf && (
                <Image src={p.imagenForPdf} style={styles.productoImgLeft} />
              )}
              <View style={styles.productoDetails}>
                <Text style={styles.productoName}>{p.nombre}</Text>
                {p.descripcion && (
                  <Text style={styles.productoDesc}>{p.descripcion}</Text>
                )}
                <View style={{ flexGrow: 1 }} />
                <View style={styles.priceBlock}>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Precio</Text>
                    <Text style={styles.priceValue}>
                      S/ {formatMoney(precio)}
                    </Text>
                  </View>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Cantidad</Text>
                    <Text style={styles.priceValue}>{cantidad}</Text>
                  </View>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Importe</Text>
                    <Text style={styles.priceValue}>
                      S/ {formatMoney(importe)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Total con desglose */}
        <View style={styles.totalWrap}>
          <Text style={styles.totalText}>
            Subtotal: S/ {formatMoney(subtotal)}
          </Text>
          <Text style={styles.totalText}>IGV (0%): S/ {formatMoney(igv)}</Text>
          <Text style={styles.totalText}>Total: S/ {formatMoney(total)}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Condiciones:</Text> Precios en
            soles e IGV incluido (salvo indicación contraria). Validez de la
            proforma: 7 días. Entrega sujeta a stock. Plazo de entrega típico:
            24–48 horas.
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Pago:</Text> Transferencia o
            depósito. BCP Soles: 123-456789-0-12 — A nombre de{" "}
            {empresa?.nombre || "Bicicentro Carlitos"}.
          </Text>
          <Text>
            Esta es una proforma informativa, no constituye comprobante de pago.
          </Text>
          <Text>
            * Venta sujeta a exoneración de IGV según Ley de la Amazonía (D.S. N.º
            055-99-EF).
          </Text>
        </View>

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
