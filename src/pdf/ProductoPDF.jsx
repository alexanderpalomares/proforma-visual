// src/pdf/ProductoPDF.jsx
import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
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
});

// Función auxiliar para formatear moneda en PEN
const PEN = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (n) => PEN.format(Number(n) || 0);

const ProductoPDF = ({ producto, idx }) => {
  const precio = Number(producto.precio) || 0;
  const cantidad = Number(producto.cantidad) || 0;
  const importe = precio * cantidad;

  return (
    <View
      style={[styles.productoRow, idx > 0 && styles.productoSeparator]}
    >
      {producto.imagenForPdf && (
        <Image src={producto.imagenForPdf} style={styles.productoImgLeft} />
      )}
      <View style={styles.productoDetails}>
        <Text style={styles.productoName}>{producto.nombre}</Text>
        {producto.descripcion && (
          <Text style={styles.productoDesc}>{producto.descripcion}</Text>
        )}
        <View style={{ flexGrow: 1 }} />
        <View style={styles.priceBlock}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Precio</Text>
            <Text style={styles.priceValue}>S/ {formatMoney(precio)}</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Cantidad</Text>
            <Text style={styles.priceValue}>{cantidad}</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Importe</Text>
            <Text style={styles.priceValue}>S/ {formatMoney(importe)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductoPDF;
