"use client";
import { useState, useEffect } from "react";
import OfferModal from "./OfferModal";
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";

export default function ProductCard({ producto, yaOfrecido, onClick }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [notificando, setNotificando] = useState(false);
  const [notificado, setNotificado] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !yaOfrecido) return;

    // Revisamos en tiempo real si ya existe notificación
    const q = query(
      collection(db, "notificaciones"),
      where("productoId", "==", producto.id),
      where("vendedorId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotificado(!snapshot.empty);
    });

    return () => unsubscribe();
  }, [producto.id, yaOfrecido]);

  const handleOfrecer = () => {
    onClick(); // guardar en firebase productosOfrecidos
    setMostrarModal(true); // abre modal con info para copiar
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
        valorGanancia: producto.valorGanancia,
        fecha: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error al notificar al negocio:", error);
    } finally {
      setNotificando(false);
    }
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

        {producto.valorGanancia && (
          <p className="text-sm text-gray-700 mb-4">
            <span className="text-black font-semibold">Ganancia:</span>{" "}
            <span className="text-green-600 font-semibold">
              ${producto.valorGanancia} MXN
            </span>
          </p>
        )}

        {!yaOfrecido && (
          <button
            onClick={handleOfrecer}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition mb-2"
          >
            Ofrecer producto
          </button>
        )}

        {yaOfrecido && !notificado && (
          <button
            onClick={handleNotificar}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={notificando}
          >
            {notificando ? "Enviando..." : "Notificar al negocio"}
          </button>
        )}

        {yaOfrecido && notificado && (
          <button
            disabled
            className="w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed"
          >
            Notificado ✔
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
