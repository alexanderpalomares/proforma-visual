import React from "react";

const styles = {
  productoRow: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  productoSeparator: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid #EDEDED",
  },
  productoImgLeft: {
    width: 350,
    height: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  productoImgTag: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  productoDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    flex: "1 1 0",
    minWidth: 320,
    maxWidth: 320,
    marginLeft: "auto",
  },
  productoName: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: 700,
    fontSize: 17,
    textTransform: "uppercase",
    textAlign: "right",
    marginBottom: 10,
  },
  productoDesc: {
    fontSize: 13,
    textAlign: "right",
    maxWidth: "100%",
    alignSelf: "flex-end",
    lineHeight: 1.2,
  },
  grow: { flexGrow: 1 },
  priceBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
    width: "100%",
    flexWrap: "nowrap",
  },
  priceItem: { minWidth: 120, textAlign: "right" },
  priceLabel: { fontSize: 12, color: "#666", fontWeight: 700 },
  priceValue: { fontSize: 14, fontWeight: 700 },
};

export default function ProductoRow({ producto, idx, formatMoney }) {
  const precio = Number(producto.precio) || 0;
  const cantidad = Number(producto.cantidad) || 0;
  const importe = precio * cantidad;
  const tieneImagen =
    producto.imagenForPdf || producto.imagenPreview || producto.imagenFile || producto.imagen;

  return (
    <div
      style={{
        ...styles.productoRow,
        ...(idx > 0 ? styles.productoSeparator : {}),
      }}
    >
      <div style={styles.productoImgLeft}>
        {tieneImagen && (
          <img
            src={producto.imagenForPdf || producto.imagenPreview || producto.imagenFile || producto.imagen}
            alt={producto.nombre || "Producto"}
            style={styles.productoImgTag}
          />
        )}
      </div>

      <div style={styles.productoDetails}>
        <div style={styles.productoName}>{producto.nombre}</div>
        {producto.descripcion && <div style={styles.productoDesc}>{producto.descripcion}</div>}

        <div style={styles.grow} />

        <div style={styles.priceBlock}>
          <div style={styles.priceItem}>
            <div style={styles.priceLabel}>Precio</div>
            <div style={styles.priceValue}>S/ {formatMoney(precio)}</div>
          </div>
          <div style={styles.priceItem}>
            <div style={styles.priceLabel}>Cantidad</div>
            <div style={styles.priceValue}>{cantidad}</div>
          </div>
          <div style={styles.priceItem}>
            <div style={styles.priceLabel}>Importe</div>
            <div style={styles.priceValue}>S/ {formatMoney(importe)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
