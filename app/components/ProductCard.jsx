"use client";
import { useState } from "react";
import OfferModal from "./OfferModal";
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function ProductCard({ producto, yaOfrecido, onClick }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [notificando, setNotificando] = useState(false);
  const [notificado, setNotificado] = useState(false);

  const handleOfrecer = () => {
    onClick();
    setMostrarModal(true);
  };

  const handleNotificar = async () => {
    setNotificando(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, "notificaciones"), {
        productoId: producto.id,
        vendedorId: user.uid,
        negocioId: producto.negocioId,
        fecha: new Date().toISOString(),
      });

      setNotificado(true);
    } catch (error) {
      console.error("Error al notificar al negocio:", error);
    } finally {
      setNotificando(false);
    }
  };

  const calcularGanancia = () => {
    if (producto.tipoComision === "porcentaje") {
      return ((producto.precio * producto.valorComision) / 100).toFixed(2);
    } else if (producto.tipoComision === "fijo") {
      return parseFloat(producto.valorComision).toFixed(2);
    }
    return "0.00";
  };

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-md p-4 ${
          yaOfrecido ? "opacity-50 border border-gray-400" : ""
        }`}
      >
        {producto.imagenUrl && (
          <div className="w-full h-40 flex items-center justify-center mb-2 overflow-hidden">
            <img
              src={producto.imagenUrl}
              alt={producto.nombre}
              className="max-h-full object-contain"
            />
          </div>
        )}

        <h3 className="text-lg font-semibold mb-1 text-gray-900">
          {producto.nombre}
        </h3>

        <p className="text-sm text-gray-700 mb-1">{producto.descripcion}</p>
        <p className="text-green-600 font-bold mb-1">${producto.precio}</p>

        {producto.inventario && (
          <p className="text-sm text-gray-700 mb-1">
            Inventario: {producto.inventario} piezas
          </p>
        )}

        {(producto.tipoComision && producto.valorComision) && (
          <p className="text-blue-600 font-semibold text-sm mb-2">
            Ganancia: ${calcularGanancia()} MXN
          </p>
        )}

        <button
          onClick={handleOfrecer}
          className={`w-full py-2 rounded transition mb-2 ${
            yaOfrecido
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
          disabled={yaOfrecido}
        >
          {yaOfrecido ? "Ya ofrecido" : "Ofrecer producto"}
        </button>

        {yaOfrecido && (
          <button
            onClick={handleNotificar}
            className={`w-full py-2 rounded transition text-white ${
              notificado
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={notificando || notificado}
          >
            {notificado ? "Notificado ✔" : "Notificar al negocio"}
          </button>
        )}
      </div>

      {mostrarModal && (
        <OfferModal
          producto={producto}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </>
  );
}
