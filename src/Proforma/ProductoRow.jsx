// src/Proforma/ProductoRow.jsx
import React from "react";

export default function ProductoRow({ producto, idx, formatMoney }) {
    const precio = Number(producto.precio) || 0;
    const cantidad = Number(producto.cantidad) || 0;
    const importe = precio * cantidad;
    const imagen =
        producto.imagenForPdf ||
        producto.imagenPreview ||
        producto.imagenFile ||
        producto.imagen;

    const styles = {
        row: {
            display: "flex",
            gap: 12,
            padding: "12px 0",
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
        },
        img: { width: "100%", height: "100%", objectFit: "contain" },
        details: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            flex: 1,
            minWidth: 280,
        },
        name: {
            fontWeight: 700,
            fontSize: 16,
            textTransform: "uppercase",
            marginBottom: 8,
        },
        desc: {
            fontSize: 12,
            textAlign: "right",
            lineHeight: 1.1,
            width: 300, // 👈 limita el ancho de la descripción
            wordWrap: "break-word",
        },
        priceBlock: {
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 8,
            width: 300,
        },
        priceItem: { flex: 1, textAlign: "right" },
        priceLabel: { fontSize: 12, fontWeight: 600, color: "#666" },
        priceValue: { fontSize: 13, fontWeight: 700 },
    };

    return (
        <div style={styles.row}>
            <div style={styles.imgWrap}>
                {imagen && (
                    <img src={imagen} alt={producto.nombre || "Producto"} style={styles.img} />
                )}
            </div>

            <div style={styles.details}>
                <div style={styles.name}>{producto.nombre}</div>
                {producto.descripcion && <div style={styles.desc}>{producto.descripcion}</div>}

                <div style={{ flexGrow: 1 }} />

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
