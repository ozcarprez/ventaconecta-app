"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function RegistroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rol, setRol] = useState("negocio"); // valor por defecto

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar la info del usuario en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        email: user.email,
        rol: rol,
        fechaRegistro: new Date().toLocaleString("es-MX", { timeZone: "America/Tijuana" }),
      });

      router.push("/login");
    } catch (err) {
      console.error("Error al registrar:", err);
      setError("Hubo un error al registrarse.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleRegistro} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear cuenta</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <label className="block text-sm font-medium text-gray-700 mb-1">Selecciona tu rol:</label>
        <select
          className="w-full mb-4 p-2 border border-gray-400 rounded bg-white text-gray-800"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="negocio">Negocio</option>
          <option value="vendedor">Vendedor</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Registrarme
        </button>
      </form>
    </div>
  );
}
