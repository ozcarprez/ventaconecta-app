"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseConfig";
import ProductCard from "../../components/ProductCard";

export default function ProductosDisponibles() {
  const [productos, setProductos] = useState([]);
  const [productosOfrecidos, setProductosOfrecidos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const productosArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(productosArray);
    };

    const obtenerOfrecidos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(
        collection(db, `usuarios/${user.uid}/productosOfrecidos`)
      );

      const ofrecidosArray = snapshot.docs.map((doc) => doc.id);
      setProductosOfrecidos(ofrecidosArray);
    };

    obtenerProductos();
    obtenerOfrecidos();
  }, []);

  const handleOfrecer = async (productoId) => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(
      doc(db, `usuarios/${user.uid}/productosOfrecidos/${productoId}`),
      { fecha: new Date().toISOString() }
    );

    setProductosOfrecidos((prev) => [...prev, productoId]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Productos disponibles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <ProductCard
            key={producto.id}
            producto={producto}
            yaOfrecido={productosOfrecidos.includes(producto.id)}
            onClick={() => handleOfrecer(producto.id)}
          />
        ))}
      </div>
    </div>
  );
}
