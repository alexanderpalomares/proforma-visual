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

  // HEADER
  headerContainer: {
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
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  headerTextGroup: {
    flexDirection: "column",
    justifyContent: "center",
    lineHeight: 1.1,
    color: "#000",
  },
  empresaNombre: { fontFamily: "Poppins", fontSize: 12, fontWeight: "bold" },
  empresaDato: { fontSize: 10, color: "#333" },

  proformaBlock: { textAlign: "right" },
  proformaTitle: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  proformaNumber: { fontSize: 11, marginTop: 2 },

  // CLIENTE
  clienteSection: {
    paddingTop: 6,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },
  clienteLabel: { fontWeight: "bold", marginBottom: 2 },

  // PRODUCTOS
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

  // TOTALES
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

  // FOOTER
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerCol: { width: "32%" },
  footerTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  footerText: {
    fontSize: 9,
    color: "#333",
    marginBottom: 2,
  },
  gracias: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 9,
  },

  // Nº de página
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
  const subtotal = total;
  const igv = 0.0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
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
              {empresa.direccion && (
                <Text style={styles.empresaDato}>{empresa.direccion}</Text>
              )}
              {empresa.telefono && (
                <Text style={styles.empresaDato}>{empresa.telefono}</Text>
              )}
              {empresa.correo && (
                <Text style={styles.empresaDato}>{empresa.correo}</Text>
              )}
              {empresa.web && <Text style={styles.empresaDato}>{empresa.web}</Text>}
            </View>
          </View>
          <View style={styles.proformaBlock}>
            <Text style={styles.proformaTitle}>PROFORMA</Text>
            {numeroProforma && (
              <Text style={styles.proformaNumber}>N°: {numeroProforma}</Text>
            )}
            {cliente.fecha && <Text>{cliente.fecha}</Text>}
          </View>
        </View>

        {/* CLIENTE */}
        <View style={styles.clienteSection}>
          <Text style={styles.clienteLabel}>Cliente</Text>
          {cliente.nombre && <Text>{cliente.nombre}</Text>}
          {cliente.ruc && <Text>{cliente.ruc}</Text>}
          {cliente.direccion && <Text>{cliente.direccion}</Text>}
        </View>

        {/* PRODUCTOS */}
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

        {/* TOTALES */}
        <View style={styles.totalWrap}>
          <Text style={styles.totalText}>
            Subtotal: S/ {formatMoney(subtotal)}
          </Text>
          <Text style={styles.totalText}>IGV (0%): S/ {formatMoney(igv)}</Text>
          <Text style={styles.totalText}>Total: S/ {formatMoney(total)}</Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerCol}>
            <Text style={styles.footerTitle}>Observaciones:</Text>
            <Text style={styles.footerText}>
              {observaciones || "—"}
            </Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerTitle}>Datos Bancarios:</Text>
            {banco?.cuenta && (
              <Text style={styles.footerText}>Cuenta: {banco.cuenta}</Text>
            )}
            {banco?.cci && (
              <Text style={styles.footerText}>CCI: {banco.cci}</Text>
            )}
            {banco?.titular && (
              <Text style={styles.footerText}>Titular: {banco.titular}</Text>
            )}
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerTitle}>Términos y Condiciones:</Text>
            <Text style={styles.footerText}>- Los precios son válidos por 7 días.</Text>
            <Text style={styles.footerText}>- La garantía aplica solo a defectos de fábrica.</Text>
            <Text style={styles.footerText}>- No se aceptan devoluciones sin comprobante.</Text>
          </View>
        </View>
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