import React from "react";

export default function FormularioFooter({ data = {}, onChange }) {
  const handleInput = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

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

  return (
    <div style={styles.wrap}>
      <div style={styles.title}>Observaciones y Datos Bancarios</div>

      <div style={styles.row}>
        <div style={styles.col}>
          <div style={styles.group}>
            <label style={styles.label}>Observaciones</label>
            <textarea
              name="observaciones"
              value={data.observaciones || ""}
              onChange={handleInput}
              style={styles.textarea}
              placeholder="Ej: La entrega está sujeta a stock disponible..."
            />
          </div>
        </div>

        <div style={styles.col}>
          <div style={styles.group}>
            <label style={styles.label}>Cuenta Bancaria</label>
            <input
              type="text"
              name="cuentaBancaria"
              value={data.cuentaBancaria || ""}
              onChange={handleInput}
              style={styles.input}
              placeholder="Ej: 123-4567890-0-11"
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>CCI</label>
            <input
              type="text"
              name="cci"
              value={data.cci || ""}
              onChange={handleInput}
              style={styles.input}
              placeholder="Ej: 00212300456789001199"
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Titular</label>
            <input
              type="text"
              name="titular"
              value={data.titular || ""}
              onChange={handleInput}
              style={styles.input}
              placeholder="Ej: Proveedores del Oriente E.I.R.L."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
