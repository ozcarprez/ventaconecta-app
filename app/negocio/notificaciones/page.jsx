"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/firebase/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  getDoc,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) return;

        const q = query(
          collection(db, "notificaciones"),
          where("negocioId", "==", user.uid),
          orderBy("fecha", "desc")
        );

        const querySnapshot = await getDocs(q);

        const data = await Promise.all(
          querySnapshot.docs.map(async (docNoti) => {
            const dataNoti = docNoti.data();

            const productoDoc = await getDoc(
              doc(db, "productos", dataNoti.productoId)
            );
            const productoData = productoDoc.exists() ? productoDoc.data() : {};

            const vendedorDoc = await getDoc(
              doc(db, "usuarios", dataNoti.vendedorId)
            );
            const vendedorData = vendedorDoc.exists()
              ? vendedorDoc.data()
              : {};

            return {
              id: docNoti.id,
              productoId: dataNoti.productoId,
              vendedorId: dataNoti.vendedorId,
              negocioId: dataNoti.negocioId,
              valorGanancia: dataNoti.valorGanancia,
              producto: productoData.nombre || "Producto eliminado",
              vendedor: vendedorData.email || "Vendedor eliminado",
              fecha: new Date(dataNoti.fecha).toLocaleString(),
            };
          })
        );

        setNotificaciones(data);
      });
    };

    fetchNotificaciones();
  }, []);

  const handleVentaConfirmada = async (noti) => {
    try {
      // Registrar venta
      await addDoc(collection(db, "ventas"), {
        productoId: noti.productoId,
        vendedorId: noti.vendedorId,
        negocioId: noti.negocioId,
        ganancia: noti.valorGanancia,
        fechaVenta: new Date().toISOString(),
      });

      // Eliminar notificación
      await deleteDoc(doc(db, "notificaciones", noti.id));

      setNotificaciones(notificaciones.filter((n) => n.id !== noti.id));

      alert("Venta registrada y vendedor notificado.");
    } catch (error) {
      console.error("Error al confirmar venta:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Notificaciones de clientes interesados
      </h1>

      {notificaciones.length === 0 ? (
        <p className="text-center text-gray-500">
          No tienes notificaciones nuevas.
        </p>
      ) : (
        <div className="space-y-4">
          {notificaciones.map((noti) => (
            <div
              key={noti.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-gray-900">
                  Producto: {noti.producto}
                </p>
                <p className="text-gray-700 text-sm">
                  Vendedor: {noti.vendedor}
                </p>
                <p className="text-green-700 text-sm">
                  Ganancia vendedor: ${noti.valorGanancia} MXN
                </p>
                <p className="text-gray-500 text-xs">Fecha: {noti.fecha}</p>
              </div>

              <button
                onClick={() => handleVentaConfirmada(noti)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                Producto vendido
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
