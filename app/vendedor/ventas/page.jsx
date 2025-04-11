"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseConfig";

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(
        collection(db, `usuarios/${user.uid}/historialVentas`)
      );

      const ventasArray = await Promise.all(
        snapshot.docs.map(async (ventaDoc) => {
          const dataVenta = ventaDoc.data();

          const productoDoc = await getDoc(
            doc(db, "productos", dataVenta.productoId)
          );

          const productoData = productoDoc.exists() ? productoDoc.data() : {};

          return {
            id: ventaDoc.id,
            nombre: productoData.nombre || "Producto eliminado",
            descripcion: productoData.descripcion || "",
            imagenUrl: productoData.imagenUrl || "",
            precio: productoData.precio || "",
            ganancia: dataVenta.ganancia || "",
            fechaVenta: new Date(dataVenta.fechaVenta).toLocaleString(),
          };
        })
      );

      setVentas(ventasArray);
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
          No tienes ventas registradas aún.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ventas.map((venta) => (
            <div
              key={venta.id}
              className="bg-white p-4 rounded shadow-md"
            >
              {venta.imagenUrl && (
                <img
                  src={venta.imagenUrl}
                  alt={venta.nombre}
                  className="w-full h-40 object-contain mb-2 rounded mx-auto"
                />
              )}

              <h2 className="font-bold text-gray-900">{venta.nombre}</h2>
              <p className="text-sm text-gray-700">{venta.descripcion}</p>
              <p className="text-green-600 font-bold mb-1">
                Precio venta: ${venta.precio}
              </p>
              <p className="text-blue-600 font-bold mb-1">
                Ganancia: ${venta.ganancia}
              </p>
              <p className="text-gray-500 text-xs">{venta.fechaVenta}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
