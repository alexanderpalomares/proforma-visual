import React from "react";

export default function FormularioFooter({ formData, setFormData }) {
  const styles = {
    wrap: {
      marginTop: 20,
      padding: 16,
      border: "1px solid #E5E5E5",
      borderRadius: 8,
      background: "#fff",
    },
    title: {
      fontWeight: 600,
      fontSize: 14,
      marginBottom: 12,
      color: "#111",
    },
    row: {
      display: "flex",
      gap: 20,
      flexWrap: "wrap",
    },
    col: {
      flex: 1,
      minWidth: 280,
    },
    group: {
      marginBottom: 12,
    },
    label: {
      display: "block",
      fontSize: 13,
      fontWeight: 500,
      marginBottom: 4,
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "8px 10px",
      border: "1px solid #ccc",
      borderRadius: 6,
      fontSize: 13,
    },
    textarea: {
      width: "100%",
      minHeight: 100,
      padding: "8px 10px",
      border: "1px solid #ccc",
      borderRadius: 6,
      fontSize: 13,
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>Observaciones y Datos Bancarios</div>

      <div style={styles.row}>
        {/* Observaciones */}
        <div style={styles.col}>
          <div style={styles.group}>
            <label style={styles.label}>Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones || ""}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Ej: La entrega está sujeta a stock disponible..."
            />
          </div>
        </div>

        {/* Datos Bancarios */}
        <div style={styles.col}>
          <div style={styles.group}>
            <label style={styles.label}>Cuenta Bancaria</label>
            <input
              type="text"
              name="cuentaBancaria"
              value={formData.cuentaBancaria || ""}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ej: 123-4567890-0-11"
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>CCI</label>
            <input
              type="text"
              name="cci"
              value={formData.cci || ""}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ej: 00212300456789001199"
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Titular</label>
            <input
              type="text"
              name="titular"
              value={formData.titular || ""}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ej: Proveedores del Oriente E.I.R.L."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
