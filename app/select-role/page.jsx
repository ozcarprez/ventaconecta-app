"use client";
import { useRouter } from "next/navigation";

export default function SelectRolePage() {
  const router = useRouter();

  const handleSelect = (role) => {
    router.push(`/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">¿Cómo deseas ingresar?</h1>
        <div className="flex flex-col gap-4">
          <button
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            onClick={() => handleSelect("negocio")}
          >
            Entrar como Negocio
          </button>
          <button
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            onClick={() => handleSelect("vendedor")}
          >
            Entrar como Vendedor
          </button>
        </div>
      </div>
    </div>
  );
}
