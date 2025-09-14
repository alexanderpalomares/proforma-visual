// App.jsx
import React, { useState } from "react";
import SectionCard from "./Proforma/SectionCard";
import FormularioEmpresa from "./Proforma/FormularioEmpresa";
import FormularioCliente from "./Proforma/FormularioCliente";
import FormularioProductosMultiples from "./Proforma/FormularioProductosMultiples";
import PrevisualizacionProforma from "./Proforma/PrevisualizacionProforma";

function App() {
  const [empresa, setEmpresa] = useState({
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
    correo: "",
    instagram: "",
    logo: ""
  });

  const [cliente, setCliente] = useState({
    nombre: "",
    ruc: "",
    direccion: "",
    fecha: ""
  });

  const [productos, setProductos] = useState([]);
  const [mostrarPrevisualizacion, setMostrarPrevisualizacion] = useState(false);

  // Función para cambiar de etapa
  const abrirPrevisualizacion = () => setMostrarPrevisualizacion(true);
  const cerrarPrevisualizacion = () => setMostrarPrevisualizacion(false);

  // 🔄 NUEVO: funciones para limpiar campos
  const limpiarCliente = () => {
    setCliente({
      nombre: "",
      ruc: "",
      direccion: "",
      fecha: ""
    });
  };

  const limpiarProductos = () => {
    setProductos([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {!mostrarPrevisualizacion ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard title="Ingresa los datos de tu empresa" className="h-full">
                <FormularioEmpresa empresa={empresa} setEmpresa={setEmpresa} />
              </SectionCard>

              <SectionCard title="Ingresa los datos de tu cliente" className="h-full">
                <FormularioCliente cliente={cliente} setCliente={setCliente} />
              </SectionCard>
            </div>

            <SectionCard title="Ingresa tus productos" className="col-span-2">
              <FormularioProductosMultiples
                cliente={cliente}
                productos={productos}
                setProductos={setProductos}
                manejarMostrarPrevisualizacion={abrirPrevisualizacion}
              />
            </SectionCard>
          </>
        ) : (
          <PrevisualizacionProforma
            empresa={empresa}
            cliente={cliente}
            productos={productos}
            onVolver={cerrarPrevisualizacion}
            onLimpiarCliente={limpiarCliente}
            onLimpiarProductos={limpiarProductos}
          />
        )}
      </div>
    </div>
  );
}

export default App;
