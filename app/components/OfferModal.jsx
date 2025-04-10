"use client";
import { useState } from "react";

export default function OfferModal({ producto, onClose }) {
  const textoOferta = `Producto: ${producto.nombre}
Talla: ${producto.descripcion}
Precio: ${producto.precio} MXN

Negocio establecido, pasar a ver, probar, comprar.
Contáctame por mensaje 📲`;

  const handleCopy = () => {
    navigator.clipboard.writeText(textoOferta);
    alert("Texto copiado ✔️");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Listo para copiar
        </h2>

        <textarea
          className="w-full p-2 border rounded text-gray-800 mb-4"
          rows="6"
          readOnly
          value={textoOferta}
        />

        <div className="flex flex-col gap-2">
          <button
            onClick={handleCopy}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Copiar texto
          </button>

          {producto.imagenUrl && (
            <a
              href={producto.imagenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 block text-center"
            >
              Ver imagen
            </a>
          )}

          <button
            onClick={onClose}
            className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
