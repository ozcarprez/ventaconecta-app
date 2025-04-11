"use client";
import { useState } from "react";
import { db, storage, auth } from "@/firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function NuevoProductoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    inventario: "",
    tipoComision: "Porcentaje",
    valorGanancia: "",
    imagen: null,
  });

  const [subiendo, setSubiendo] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubiendo(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");

      let imagenUrl = "";

      if (formData.imagen) {
        const storageRef = ref(storage, `productos/${Date.now()}-${formData.imagen.name}`);
        await uploadBytes(storageRef, formData.imagen);
        imagenUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "productos"), {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        inventario: parseInt(formData.inventario),
        tipoComision: formData.tipoComision,
        valorGanancia: parseFloat(formData.valorGanancia),
        imagenUrl,
        negocioId: user.uid,
        creado: Timestamp.now(),
      });

      alert("Producto subido correctamente ✅");

      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        inventario: "",
        tipoComision: "Porcentaje",
        valorGanancia: "",
        imagen: null,
      });
    } catch (error) {
      console.error("Error al subir producto:", error);
      alert("Error al subir producto ❌");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Subir nuevo producto</h2>

        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="w-full mb-2 p-2 border rounded text-black" required />
        <input name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full mb-2 p-2 border rounded text-black" required />
        <input name="precio" value={formData.precio} onChange={handleChange} placeholder="Precio" className="w-full mb-2 p-2 border rounded text-black" required />
        <input name="categoria" value={formData.categoria} onChange={handleChange} placeholder="Categoría" className="w-full mb-2 p-2 border rounded text-black" required />
        <input name="inventario" value={formData.inventario} onChange={handleChange} placeholder="Inventario" className="w-full mb-2 p-2 border rounded text-black" required />
        
        <select name="tipoComision" value={formData.tipoComision} onChange={handleChange} className="w-full mb-2 p-2 border rounded text-black">
          <option>Porcentaje</option>
          <option>Fijo</option>
        </select>

        <input name="valorGanancia" value={formData.valorGanancia} onChange={handleChange} placeholder="Valor comisión" className="w-full mb-2 p-2 border rounded text-black" required />
        <input type="file" name="imagen" onChange={handleChange} accept="image/*" className="w-full mb-4 text-black" required />

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          {subiendo ? "Subiendo..." : "Subir producto"}
        </button>
      </form>
    </div>
  );
}
