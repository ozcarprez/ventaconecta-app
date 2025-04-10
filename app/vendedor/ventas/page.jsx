"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  orderBy,
} from "firebase/firestore";

export default function HistorialVentasPage() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const obtenerVentas = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "ventas"),
        where("vendedorId", "==", user.uid),
        orderBy("fecha", "desc")
      );

      const querySnapshot = await getDocs(q);

      const ventasArray = await Promise.all(
        querySnapshot.docs.map(async (docVenta) => {
          const dataVenta = docVenta.data();

          const productoDoc = await getDoc(
            doc(db, "productos", dataVenta.productoId)
          );
          const productoData = productoDoc.exists()
            ? productoDoc.data()
            : {};

          return {
            id: docVenta.id,
            producto: productoData.nombre || "Producto eliminado",
            imagenUrl: productoData.imagenUrl || "",
            valorGanancia: dataVenta.valorGanancia,
            fecha: new Date(dataVenta.fecha).toLocaleString(),
          };
        })
      );

      setVentas(ventasArray);
    };

    obtenerVentas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Historial de Ventas
      </h2>

      {ventas.length === 0 ? (
        <p className="text-center text-gray-500">
          No tienes ventas registradas aún.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ventas.map((venta) => (
            <div key={venta.id} className="bg-white p-4 rounded shadow">
              {venta.imagenUrl && (
                <div className="w-full h-40 mb-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={venta.imagenUrl}
                    alt={venta.producto}
                    className="max-h-full object-contain"
                  />
                </div>
              )}

              <h3 className="font-bold text-gray-900">{venta.producto}</h3>
              <p className="text-green-600 font-bold">
                Ganancia: ${venta.valorGanancia} MXN
              </p>
              <p className="text-gray-500 text-sm">{venta.fecha}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
