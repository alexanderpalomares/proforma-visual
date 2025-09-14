import React from "react";

export default function FormularioCliente({ cliente, setCliente }) {
  const onChange = e => setCliente({ ...cliente, [e.target.name]: e.target.value });
  const input = "w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="grid grid-cols-1 gap-4">
      <input className={input} name="nombre"    placeholder="Ramón Manrique" value={cliente.nombre} onChange={onChange}/>
      <input className={input} name="ruc"       placeholder="46420566" value={cliente.ruc} onChange={onChange}/>
      <input className={input} name="direccion" placeholder="Jr. Alfonso Ugarte 392, Tarapoto" value={cliente.direccion} onChange={onChange}/>
      <input className={input} type="date" name="fecha" value={cliente.fecha} onChange={onChange}/>
    </div>
  );
}
