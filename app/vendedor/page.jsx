"use client"
import { useRouter } from 'next/navigation'

export default function VendedorPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Panel del Vendedor</h1>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => router.push('/vendedor/productos')}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Ver productos disponibles
          </button>

          <button 
            onClick={() => router.push('/vendedor/ventas')}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Historial de ventas
          </button>
        </div>
      </div>
    </div>
  );
}

  