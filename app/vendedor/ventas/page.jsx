"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseConfig";

export default function HistorialVentas() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductosOfrecidos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(
        collection(db, `usuarios/${user.uid}/productosOfrecidos`)
      );

      const productosArray = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const productoRef = doc(db, "productos", docSnap.id);
          const productoDoc = await getDoc(productoRef);

          return productoDoc.exists()
            ? { id: productoDoc.id, ...productoDoc.data() }
            : null;
        })
      );

      setProductos(productosArray.filter((p) => p)); // eliminamos nulls
    };

    obtenerProductosOfrecidos();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Historial de ventas
      </h2>

      {productos.length === 0 ? (
        <p className="text-center text-white">
          No has ofrecido productos aún.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white p-4 rounded shadow-md"
            >
              {producto.imagenUrl && (
                <img
                  src={producto.imagenUrl}
                  alt={producto.nombre}
                  className="w-full h-40 object-contain mb-2 rounded mx-auto"
                />
              )}

              <h2 className="font-bold text-gray-900">{producto.nombre}</h2>
              <p className="text-sm text-gray-700">{producto.descripcion}</p>
              <p className="text-green-600 font-bold">${producto.precio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
