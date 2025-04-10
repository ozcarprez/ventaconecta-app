"use client";
import { useState } from "react";
import { db, storage, auth } from "@/firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";

export default function NuevoProductoPage() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [inventario, setInventario] = useState("");
  const [tipoComision, setTipoComision] = useState("porcentaje");
  const [valorComision, setValorComision] = useState("");
  const [imagen, setImagen] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubiendo(true);
    setMensaje("");

    try {
      const user = auth.currentUser;
      if (!user) return;

      let imagenUrl = "";
      if (imagen) {
        const storageRef = ref(storage, `productos/${Date.now()}-${imagen.name}`);
        await uploadBytes(storageRef, imagen);
        imagenUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "productos"), {
        nombre,
        descripcion,
        precio,
        categoria,
        inventario: parseInt(inventario),
        tipoComision,
        valorComision,
        negocioId: user.uid,
        imagenUrl,
        fecha: new Date().toISOString(),
      });

      setMensaje("Producto subido exitosamente ✔️");
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setCategoria("");
      setInventario("");
      setTipoComision("porcentaje");
      setValorComision("");
      setImagen(null);
      router.push("/negocio");

    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ Hubo un error al subir el producto.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Subir nuevo producto
        </h1>

        {[
          { placeholder: "Nombre", value: nombre, set: setNombre },
          { placeholder: "Descripción", value: descripcion, set: setDescripcion, type: "textarea" },
          { placeholder: "Precio", value: precio, set: setPrecio, type: "number" },
          { placeholder: "Categoría", value: categoria, set: setCategoria },
          { placeholder: "Inventario disponible", value: inventario, set: setInventario, type: "number" },
        ].map((input, idx) => (
          input.type === "textarea" ? (
            <textarea
              key={idx}
              placeholder={input.placeholder}
              value={input.value}
              onChange={(e) => input.set(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-600 text-gray-900 mb-4"
              required
            />
          ) : (
            <input
              key={idx}
              type={input.type || "text"}
              placeholder={input.placeholder}
              value={input.value}
              onChange={(e) => input.set(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-600 text-gray-900 mb-4"
              required
            />
          )
        ))}

        <select
          value={tipoComision}
          onChange={(e) => setTipoComision(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 mb-4"
        >
          <option value="porcentaje">Comisión %</option>
          <option value="fijo">Pago fijo $</option>
        </select>

        <input
          type="number"
          placeholder={tipoComision === "porcentaje" ? "Porcentaje de comisión" : "Pago fijo en MXN"}
          value={valorComision}
          onChange={(e) => setValorComision(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-600 text-gray-900 mb-4"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 mb-4"
        />

        <button
          type="submit"
          disabled={subiendo}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 w-full"
        >
          {subiendo ? "Subiendo..." : "Subir producto"}
        </button>

        {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
      </form>
    </div>
  );
}
