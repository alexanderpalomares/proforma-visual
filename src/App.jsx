// src/App.jsx
import React, { useState } from "react";
import Portada from "./pages/Portada";
import Wizard from "./Proforma/Wizard";  

function App() {
  const [mostrarPortada, setMostrarPortada] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {mostrarPortada ? (
        <Portada onComenzar={() => setMostrarPortada(false)} />
      ) : (
        <Wizard />
      )}
    </div>
  );
}

export default App;
