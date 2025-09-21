// src/Portada.jsx
import React from "react";

export default function Portada({ onComenzar }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "linear-gradient(135deg, #fefcea 0%, #f1da36 100%)",
                fontFamily: "Poppins, sans-serif",
                textAlign: "center",
                padding: 24,
            }}
        >
            {/* Logo */}
            <img
                src="/proforma-preview.svg"   // 👈 o .svg si ese es el formato
                alt="Proforma preview"
                style={{
                    width: 120,
                    height: 120,
                    borderRadius: 16,
                    marginBottom: 24,
                }}
            />

            {/* Título */}
            <h1
                style={{
                    fontSize: "2.2rem",
                    fontWeight: "700",
                    marginBottom: 12,
                    color: "#111",
                }}
            >
                Tu proforma con imágenes
            </h1>

            {/* Subtítulo */}
            <h2
                style={{
                    fontSize: "1.5rem",
                    fontWeight: "500",
                    marginBottom: 24,
                    color: "#333",
                }}
            >
                Fácil y rápido 🚀
            </h2>

            {/* Texto breve */}
            <p
                style={{
                    fontSize: "1rem",
                    color: "#444",
                    maxWidth: 500,
                    marginBottom: 32,
                }}
            >
                Genera proformas profesionales con fotos de tus productos en segundos.
                Simple, visual y lista para enviar a tus clientes.
            </p>

            {/* Botón principal */}
            <button
                onClick={onComenzar}
                style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    padding: "14px 28px",
                    fontSize: "1.2rem",
                    borderRadius: 10,
                    fontWeight: "600",
                    cursor: "pointer",
                    border: "none",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
            >
                Comenzar ahora
            </button>
        </div>
    );
}
