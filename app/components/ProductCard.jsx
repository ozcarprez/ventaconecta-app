"use client";
import { useState, useEffect } from "react";
import OfferModal from "./OfferModal";
import { db, auth } from "@/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export default function ProductCard({ producto, yaOfrecido, onClick }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [notificando, setNotificando] = useState(false);
  const [notificado, setNotificado] = useState(false);
  const [ofrecido, setOfrecido] = useState(yaOfrecido);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "notificaciones"),
      where("productoId", "==", producto.id),
      where("vendedorId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setOfrecido(false); // puede volver a ofrecer
      } else {
        setOfrecido(true); // ya ofreció
      }
    });

    return () => unsubscribe();
  }, [producto.id]);

  const handleOfrecer = () => {
    onClick(); // guarda en firebase
    setMostrarModal(true); // muestra modal
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

      setNotificado(true);
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
          ofrecido ? "opacity-50 border border-gray-400" : ""
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

        <button
          onClick={handleOfrecer}
          className={`w-full py-2 rounded transition mb-2 ${
            ofrecido
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
          disabled={ofrecido}
        >
          {ofrecido ? "Ya ofrecido" : "Ofrecer producto"}
        </button>

        {ofrecido && (
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
