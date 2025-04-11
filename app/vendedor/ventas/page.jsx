"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseConfig";

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "ventas"),
        where("vendedorId", "==", user.uid),
        orderBy("fechaVenta", "desc")
      );

      const snapshot = await getDocs(q);

      const ventasData = await Promise.all(
        snapshot.docs.map(async (ventaDoc) => {
          const venta = ventaDoc.data();

          const productoDoc = await getDoc(doc(db, "productos", venta.productoId));
          const productoData = productoDoc.exists() ? productoDoc.data() : {};

          return {
            id: ventaDoc.id,
            producto: productoData.nombre || "Producto eliminado",
            imagenUrl: productoData.imagenUrl || "",
            ganancia: venta.ganancia,
            fecha: new Date(venta.fechaVenta).toLocaleString(),
          };
        })
      );

      setVentas(ventasData);
    };

    fetchVentas();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Historial de ventas
      </h2>

      {ventas.length === 0 ? (
        <p className="text-center text-white">
          Aún no tienes productos vendidos.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ventas.map((venta) => (
            <div key={venta.id} className="bg-white p-4 rounded shadow-md">
              {venta.imagenUrl && (
                <img
                  src={venta.imagenUrl}
                  alt={venta.producto}
                  className="w-full h-40 object-contain mb-2 rounded mx-auto"
                />
              )}

              <h2 className="font-bold text-gray-900">{venta.producto}</h2>
              <p className="text-green-600 font-bold">
                Ganaste: ${venta.ganancia} MXN
              </p>
              <p className="text-sm text-gray-700">
                Fecha de venta: {venta.fecha}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
