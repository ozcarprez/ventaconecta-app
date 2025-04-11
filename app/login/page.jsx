"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.rol === "negocio") {
          router.push("/negocio");
        } else if (userData.rol === "vendedor") {
          router.push("/vendedor");
        } else {
          setError("Rol de usuario no reconocido.");
        }
      } else {
        setError("No se encontró información del usuario.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Iniciar sesión
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

<input
  type="email"
  placeholder="Correo electrónico"
  className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

<input
  type="password"
  placeholder="Contraseña"
  className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
