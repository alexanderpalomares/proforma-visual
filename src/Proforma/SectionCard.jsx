import React from "react";

export default function SectionCard({ title, right, children, className = "" }) {
  return (
    <section className={`bg-white rounded-xl shadow-sm ring-1 ring-gray-200 ${className}`}>
      <header className="px-6 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {right}
      </header>
      <div className="p-6">
        {children}
      </div>
    </section>
  );
}
