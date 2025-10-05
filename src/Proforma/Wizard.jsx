import React, { useState } from "react";

import FormularioEmpresa from "./FormularioEmpresa";
import FormularioCliente from "./FormularioCliente";
import FormularioTipoDocumento from "./FormularioTipoDocumento";
import FormularioProductosMultiples from "./FormularioProductosMultiples";
import FormularioFooter from "./FormularioFooter";
import PrevisualizacionProforma from "./PrevisualizacionProforma";

const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    empresa: {},
    cliente: {},
    documento: {},
    productos: [],
    observaciones: {},
  });
  const [errorMessage, setErrorMessage] = useState(""); // ⚠️ Para mensajes de error visibles

  const steps = [
    "Empresa",
    "Cliente",
    "Documento",
    "Productos",
    "Observaciones",
    "Previsualización",
  ];

  const handleDataChange = (step, data) => {
    setFormData((prev) => ({
      ...prev,
      [step]: data,
    }));
    if (step === "empresa") setErrorMessage(""); // 🧼 Limpia error si usuario corrige
  };

  const nextStep = () => {
    // ✅ Validación en Paso 1
    if (currentStep === 1) {
      const { nombre, direccion, telefono } = formData.empresa;
      const valid =
        nombre?.trim().length > 0 &&
        direccion?.trim().length > 0 &&
        telefono?.trim().length > 0;

      if (!valid) {
        setErrorMessage(
          "⚠️ Por favor completa la razón social, dirección y teléfono antes de continuar."
        );
        return;
      }
    }

    setErrorMessage("");
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const resetWizard = () => {
    setFormData({
      empresa: {},
      cliente: {},
      documento: {},
      productos: [],
      observaciones: {},
    });
    setCurrentStep(1);
    setErrorMessage("");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormularioEmpresa
            data={formData.empresa}
            onChange={(data) => handleDataChange("empresa", data)}
          />
        );
      case 2:
        return (
          <FormularioCliente
            data={formData.cliente}
            onChange={(data) => handleDataChange("cliente", data)}
          />
        );
      case 3:
        return (
          <FormularioTipoDocumento
            data={formData.documento}
            onChange={(data) => handleDataChange("documento", data)}
          />
        );
      case 4:
        return (
          <FormularioProductosMultiples
            data={formData.productos}
            onChange={(data) => handleDataChange("productos", data)}
          />
        );
      case 5:
        return (
          <FormularioFooter
            data={formData.observaciones}
            onChange={(data) => handleDataChange("observaciones", data)}
          />
        );
      case 6:
        return (
          <PrevisualizacionProforma
            empresa={formData.empresa}
            cliente={formData.cliente}
            productos={formData.productos}
            tipoDocumento={formData.documento.tipo || "PROFORMA"}
            observaciones={formData.observaciones.observaciones || ""}
            banco={formData.observaciones}
            onVolver={prevStep}
            onResetWizard={resetWizard}
          />
        );
      default:
        return null;
    }
  };

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div style={styles.container}>
      {/* Barra de progreso */}
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }} />
      </div>

      {/* Círculos de pasos */}
      <div style={styles.progressWrap}>
        {steps.map((label, idx) => {
          const stepNumber = idx + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={idx} style={styles.step}>
              <div
                style={{
                  ...styles.circle,
                  backgroundColor: isCompleted
                    ? "#16a34a"
                    : isActive
                    ? "#2563eb"
                    : "#e5e7eb",
                  color: isCompleted || isActive ? "#fff" : "#6b7280",
                }}
              >
                {isCompleted ? "✔" : stepNumber}
              </div>
              <span
                style={{
                  fontSize: 12,
                  marginTop: 4,
                  color: isActive
                    ? "#2563eb"
                    : isCompleted
                    ? "#16a34a"
                    : "#6b7280",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Paso dinámico */}
      <div style={styles.stepBox}>{renderStep()}</div>

      {/* Navegación */}
      <div style={styles.buttons}>
        {currentStep > 1 && currentStep < steps.length && (
          <button style={styles.btn} onClick={prevStep}>
            Atrás
          </button>
        )}
        {currentStep < steps.length && (
          <button style={styles.btn} onClick={nextStep}>
            Siguiente
          </button>
        )}
      </div>

      {/* ⚠️ Mensaje de error visible */}
      {errorMessage && (
        <div style={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
  },
  progressBarContainer: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "12px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    transition: "width 0.3s ease",
  },
  progressWrap: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    marginBottom: 2,
    fontSize: 16,
  },
  stepBox: {
    minHeight: "400px",
    marginBottom: "20px",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 500,
  },
  errorMessage: {
    marginTop: "10px",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: 500,
  },
};

export default Wizard;
