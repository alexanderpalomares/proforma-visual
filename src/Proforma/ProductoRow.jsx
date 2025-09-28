// src/Proforma/ProductoRow.jsx
import React from "react";

export default function ProductoRow({ producto, idx, formatMoney }) {
    const precio = Number(producto.precio) || 0;
    const cantidad = Number(producto.cantidad) || 0;
    const importe = precio * cantidad;
    const tieneImagen =
        producto.imagenForPdf ||
        producto.imagenPreview ||
        producto.imagenFile ||
        producto.imagen;

    const styles = {
        row: {
            display: "flex",
            flexDirection: "row",
            gap: 12,
            paddingTop: 12,
            paddingBottom: 12,
            borderTop: idx > 0 ? "1px solid #EDEDED" : "none",
        },
        imgWrap: {
            width: 250,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
            background: "#ffffff",
        },
        img: { width: "100%", height: "100%", objectFit: "contain" },

        contentWrap: {
            display: "flex",
            flexDirection: "row",
            flex: 1,
            gap: 16,
        },
        descBlock: {
            width: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
        },
        name: {
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            textTransform: "uppercase",
            marginBottom: 8,
        },
        desc: {
            fontSize: 12,
            lineHeight: 1.3,
            color: "#333",
        },
        priceBlock: {
            width: "300px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        priceItem: { flex: 1, textAlign: "center" },
        priceLabel: { fontSize: 12, fontWeight: 600, color: "#666" },
        priceValue: { fontSize: 13, fontWeight: 700 },
    };

    return (
        <div style={styles.row}>
            <div style={styles.imgWrap}>
                {tieneImagen && (
                    <img
                        src={
                            producto.imagenForPdf ||
                            producto.imagenPreview ||
                            producto.imagenFile ||
                            producto.imagen
                        }
                        alt={producto.nombre || "Producto"}
                        style={styles.img}
                    />
                )}
            </div>

            <div style={styles.contentWrap}>
                {/* Bloque de descripción */}
                <div style={styles.descBlock}>
                    <div style={styles.name}>{producto.nombre}</div>
                    {producto.descripcion && (
                        <div style={styles.desc}>{producto.descripcion}</div>
                    )}
                </div>

                {/* Bloque de precios */}
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
