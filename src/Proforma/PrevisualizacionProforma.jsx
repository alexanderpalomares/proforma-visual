// src/Proforma/PrevisualizacionProforma.jsx
import React, { useState } from "react";

export default function PrevisualizacionProforma() {
  const [loading, setLoading] = useState(false);

  const handleExportPDF = async () => {
    setLoading(true);
    try {
      // 📌 Capturamos el HTML actual de la página (puedes afinarlo para solo capturar el contenedor de la proforma)
      const html = document.documentElement.outerHTML;

      // 🌐 URL de tu backend en Render
      const backendURL = "https://TU-BACKEND-RENDER.onrender.com/api/pdf"; // 👈 reemplaza con tu URL real

      const response = await fetch(backendURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html,
          filename: "proforma.pdf",
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo generar el PDF");
      }

      // 💾 Forzar la descarga del PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "proforma.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error al exportar PDF:", err);
      alert("Ocurrió un error al generar el PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ fontWeight: 800, fontSize: "28px" }}>
        Vista previa de la Proforma
      </h1>
      <p style={{ fontSize: "16px" }}>
        Aquí puedes previsualizar cómo se verá la proforma antes de exportarla a PDF.
      </p>

      {/* 🧾 Contenido de ejemplo de la proforma */}
      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ textAlign: "left", padding: "8px" }}>Producto</th>
            <th style={{ textAlign: "right", padding: "8px" }}>Cantidad</th>
            <th style={{ textAlign: "right", padding: "8px" }}>Precio</th>
            <th style={{ textAlign: "right", padding: "8px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "8px" }}>Cemento Portland</td>
            <td style={{ textAlign: "right", padding: "8px" }}>10</td>
            <td style={{ textAlign: "right", padding: "8px" }}>S/ 25.00</td>
            <td style={{ textAlign: "right", padding: "8px" }}>S/ 250.00</td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>Varilla 1/2"</td>
            <td style={{ textAlign: "right", padding: "8px" }}>15</td>
            <td style={{ textAlign: "right", padding: "8px" }}>S/ 37.00</td>
            <td style={{ textAlign: "right", padding: "8px" }}>S/ 555.00</td>
          </tr>
          <tr>
            <td style={{ padding: "8px" }}>Pintura Látex</td>
            <td style={{ textAlign: "right", padding: "8px" }}>5</td>
            <td style={{ textAlign: "right", padding: "8px" }}>S/ 85.00</td>
            <td style={{ textAlign: "right", padding: "8px" }}>S/ 425.00</td>
          </tr>
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: 600 }}>
            <td colSpan="3" style={{ textAlign: "right", padding: "8px" }}>
              Total:
            </td>
            <td style={{ textAlign: "right", padding: "8px" }}>
              S/ 1,230.00
            </td>
          </tr>
        </tfoot>
      </table>

      {/* 🟡 Botón Exportar PDF */}
      <button
        onClick={handleExportPDF}
        disabled={loading}
        style={{
          marginTop: "24px",
          padding: "10px 20px",
          backgroundColor: "#222",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          borderRadius: "4px",
        }}
      >
        {loading ? "Generando PDF..." : "Exportar PDF"}
      </button>
    </div>
  );
}
