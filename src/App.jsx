// src/App.jsx
import React, { useState } from "react";
import PrevisualizacionProforma from "./Proforma/PrevisualizacionProforma";

function App() {
  const [empresa] = useState({
    nombre: "Bicicentro Carlitos",
    ruc: "20601648351",
    direccion: "Jr. Máximo Gorbitz 892",
    telefono: "987916570",
    correo: "alepalomaresangel@gmail.com",
    web: "www.bicicentrocarlitos.pe",
    logo: "/favicon.png",
  });

  const [cliente] = useState({
    nombre: "Alexander Palomares",
    ruc: "20612781843",
    direccion: "Jr. Máximo Gorbitz 892",
    fecha: "2025-09-17",
  });

  const [productos] = useState([
    {
      nombre: "Bicicleta GROW UP 29",
      descripcion: "Con la BURNER 29'' le resultará más fácil controlar la bicicleta...",
      precio: 30,
      cantidad: 2,
      imagenPreview: "/bicicleta.png",
    },
  ]);

  return (
    <div>
      <PrevisualizacionProforma
        empresa={empresa}
        cliente={cliente}
        productos={productos}
        onVolver={() => console.log("Volver presionado")}
        onLimpiarCliente={() => console.log("Cliente limpiado")}
        onLimpiarProductos={() => console.log("Productos limpiados")}
      />
    </div>
  );
}

export default App;
