// src/Proforma/Header.jsx
import React from "react";

export default function Header({ empresa, numero, fecha }) {
    const styles = {
        container: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 10,
            marginBottom: 10,
            borderBottom: "1px solid #D9D9D9",
        },
        // Bloque de empresa
        empresaBlock: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        logo: {
            height: "100%",      // el logo ocupa el alto del header
            maxHeight: 60,       // límite para que no se dispare
            aspectRatio: "1/1",  // siempre cuadrado
            objectFit: "contain",
            borderRadius: 10,    // bordes suaves
        },
        textGroup: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            lineHeight: 1, // compacto
            fontSize: 12,
            color: "#111",
        },
        empresaNombre: {
            fontWeight: 800, // extra bold
            fontSize: 14,
            marginBottom: 1,
        },
        empresaDato: {
            fontSize: 12,
            color: "#333",
        },
        // Bloque derecho (Proforma)
        right: {
            textAlign: "right",
        },
        proformaTitle: {
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "Poppins, sans-serif",
        },
        proformaNumber: {
            fontSize: 12,
            fontWeight: 600,
            marginTop: 2,
        },
        proformaFecha: {
            fontSize: 12,
            color: "#333",
            marginTop: 2,
        },
    };

    return (
        <div style={styles.container}>
            {/* Bloque empresa */}
            <div style={styles.empresaBlock}>
                {empresa.logo && <img src={empresa.logo} alt="Logo" style={styles.logo} />}
                <div style={styles.textGroup}>
                    <div style={styles.empresaNombre}>{empresa.nombre}</div>
                    {empresa.ruc && <div style={styles.empresaDato}>{empresa.ruc}</div>}
                    {empresa.direccion && <div style={styles.empresaDato}>{empresa.direccion}</div>}
                    {empresa.correo && <div style={styles.empresaDato}>{empresa.correo}</div>}
                    {empresa.web && <div style={styles.empresaDato}>{empresa.web}</div>}
                </div>
            </div>

            {/* Bloque proforma */}
            <div style={styles.right}>
                <div style={styles.proformaTitle}>PROFORMA</div>
                {numero && <div style={styles.proformaNumber}>N°: {numero}</div>}
                {fecha && <div style={styles.proformaFecha}>{fecha}</div>}
            </div>
        </div>
    );
}
