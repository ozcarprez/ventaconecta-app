"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function NegocioPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("UID del negocio:", user.uid);

        const q = query(
          collection(db, "productos"),
          where("negocioId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        const productosArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(productosArray);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg text-center">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Mis Productos
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => router.push("/negocio/nuevo")}
        >
          Subir nuevo producto
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => router.push("/negocio/notificaciones")}
        >
          Ver notificaciones
        </button>
      </div>

      {productos.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg text-center">
            No has subido productos aún.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white p-4 rounded shadow-md">
              {producto.imagenUrl && (
                <div className="w-full h-40 mb-2 overflow-hidden rounded">
                  <img
                    src={producto.imagenUrl}
                    alt={producto.nombre}
                    className="w-full h-full object-contain"
                  />
                </div>
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
