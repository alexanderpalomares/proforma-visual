import React from "react";

export default function FormularioTipoDocumento({ data = {}, onChange }) {
  const tipos = ["PROFORMA", "NOTA DE PEDIDO", "NOTA DE VENTA"];

  const handleSelect = (tipo) => {
    onChange({ ...data, tipo });
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "16px",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      backgroundColor: "#fff",
    },
    label: {
      fontWeight: 600,
      marginBottom: "4px",
      fontSize: "14px",
    },
    options: {
      display: "flex",
      gap: "8px",
    },
    button: (active) => ({
      flex: 1,
      padding: "10px 16px",
      borderRadius: "6px",
      border: active ? "2px solid #2563eb" : "1px solid #d1d5db",
      backgroundColor: active ? "#2563eb" : "#f9fafb",
      color: active ? "#fff" : "#111",
      fontWeight: active ? 700 : 500,
      cursor: "pointer",
      transition: "0.2s",
    }),
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>Selecciona el tipo de documento</label>
      <div style={styles.options}>
        {tipos.map((tipo) => (
          <button
            key={tipo}
            style={styles.button(data.tipo === tipo)}
            onClick={() => handleSelect(tipo)}
            type="button"
          >
            {tipo}
          </button>
        ))}
      </div>
    </div>
  );
}
