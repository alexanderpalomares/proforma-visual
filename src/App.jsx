import React, { useState } from "react";
import SectionCard from "./Proforma/SectionCard";
import FormularioEmpresa from "./Proforma/FormularioEmpresa";
import FormularioCliente from "./Proforma/FormularioCliente";
import FormularioProductosMultiples from "./Proforma/FormularioProductosMultiples";
import FormularioTipoDocumento from "./Proforma/FormularioTipoDocumento";
import FormularioFooter from "./Proforma/FormularioFooter"; 
import PrevisualizacionProforma from "./Proforma/PrevisualizacionProforma";
import Portada from "./pages/Portada";

function App() {
  const [mostrarPortada, setMostrarPortada] = useState(true);
  const [mostrarPrevisualizacion, setMostrarPrevisualizacion] = useState(false);

  // 🔹 Estado global único
  const [formData, setFormData] = useState({
    empresa: {
      nombre: "",
      ruc: "",
      direccion: "",
      telefono: "",
      correo: "",
      instagram: "",
      logo: "",
      web: "",
    },
    cliente: {
      nombre: "",
      ruc: "",
      direccion: "",
      fecha: "",
    },
    productos: [],
    tipoDocumento: "PROFORMA",
    observaciones: "",
    cuentaBancaria: "",
    cci: "",
    titular: "",
  });

  // Funciones
  const abrirPrevisualizacion = () => setMostrarPrevisualizacion(true);
  const cerrarPrevisualizacion = () => setMostrarPrevisualizacion(false);

  const limpiarCliente = () => {
    setFormData((prev) => ({
      ...prev,
      cliente: { nombre: "", ruc: "", direccion: "", fecha: "" },
    }));
  };

  const limpiarProductos = () => {
    setFormData((prev) => ({
      ...prev,
      productos: [],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {mostrarPortada ? (
        <Portada onComenzar={() => setMostrarPortada(false)} />
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          {!mostrarPrevisualizacion ? (
            <>
              {/* Empresa y Cliente */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Ingresa los datos de tu empresa" className="h-full">
                  <FormularioEmpresa
                    empresa={formData.empresa}
                    setEmpresa={(partialEmpresa) =>
                      setFormData((prev) => ({
                        ...prev,
                        empresa: { ...prev.empresa, ...partialEmpresa }, // ✅ fusiona cambios
                      }))
                    }
                  />
                </SectionCard>

                <SectionCard title="Ingresa los datos de tu cliente" className="h-full">
                  <FormularioCliente
                    cliente={formData.cliente}
                    setCliente={(cliente) =>
                      setFormData((prev) => ({ ...prev, cliente }))
                    }
                  />
                </SectionCard>
              </div>

              {/* Tipo de Documento */}
              <SectionCard title="Selecciona el tipo de documento" className="col-span-2">
                <FormularioTipoDocumento
                  tipoDocumento={formData.tipoDocumento}
                  setTipoDocumento={(tipoDocumento) =>
                    setFormData((prev) => ({ ...prev, tipoDocumento }))
                  }
                />
              </SectionCard>

              {/* Productos */}
              <SectionCard title="Ingresa tus productos" className="col-span-2">
                <FormularioProductosMultiples
                  cliente={formData.cliente}
                  productos={formData.productos}
                  setProductos={(productos) =>
                    setFormData((prev) => ({ ...prev, productos }))
                  }
                  manejarMostrarPrevisualizacion={abrirPrevisualizacion}
                />
              </SectionCard>

              {/* Observaciones y Bancos */}
              <SectionCard title="Observaciones y Datos Bancarios" className="col-span-2">
                <FormularioFooter formData={formData} setFormData={setFormData} />
              </SectionCard>
            </>
          ) : (
            <PrevisualizacionProforma
              empresa={formData.empresa}
              cliente={formData.cliente}
              productos={formData.productos}
              tipoDocumento={formData.tipoDocumento}
              observaciones={formData.observaciones}
              banco={{
                cuenta: formData.cuentaBancaria,
                cci: formData.cci,
                titular: formData.titular,
              }}
              onVolver={cerrarPrevisualizacion}
              onLimpiarCliente={limpiarCliente}
              onLimpiarProductos={limpiarProductos}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
