"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseConfig";

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const obtenerVentas = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "ventas"),
        where("vendedorId", "==", user.uid),
        orderBy("fechaVenta", "desc")
      );

      const snapshot = await getDocs(q);

      const ventasArray = await Promise.all(
        snapshot.docs.map(async (ventaDoc) => {
          const ventaData = ventaDoc.data();

          const productoDoc = await getDoc(doc(db, "productos", ventaData.productoId));
          const productoData = productoDoc.exists() ? productoDoc.data() : {};

          return {
            id: ventaDoc.id,
            nombre: productoData.nombre || "Producto eliminado",
            descripcion: productoData.descripcion || "",
            precio: productoData.precio || 0,
            imagenUrl: productoData.imagenUrl || "",
            ganancia: ventaData.ganancia || 0,
            fechaVenta: new Date(ventaData.fechaVenta).toLocaleString(),
          };
        })
      );

      setVentas(ventasArray);
    };

    obtenerVentas();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Historial de Ventas
      </h2>

      {ventas.length === 0 ? (
        <p className="text-center text-white">
          No tienes ventas registradas aún.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ventas.map((venta) => (
            <div key={venta.id} className="bg-white p-4 rounded shadow-md">
              {venta.imagenUrl && (
                <img
                  src={venta.imagenUrl}
                  alt={venta.nombre}
                  className="w-full h-40 object-contain mb-2 rounded mx-auto"
                />
              )}

              <h2 className="font-bold text-gray-900">{venta.nombre}</h2>
              <p className="text-sm text-gray-700">{venta.descripcion}</p>
              <p className="text-green-600 font-bold mb-1">${venta.precio}</p>

              <p className="text-green-700 text-sm mb-1">
                Ganancia: ${venta.ganancia} MXN
              </p>

              <p className="text-gray-500 text-xs">
                Vendido el: {venta.fechaVenta}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
