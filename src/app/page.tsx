import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenido a <span className="text-primary">CLOTHESTYLE</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Viste bien con tu tienda de ropa en línea CLOTHESTYLE. Compra fácil, rápido y seguro.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/productos">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
              Ver Ropa
            </button>
          </Link>
          <Link href="/register">
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              Crear Cuenta
            </button>
          </Link>
        </div>
      </section>

      {/* Mini sección rápida */}
      <section className="py-10 text-center max-w-xl">
        <h2 className="text-2xl font-semibold mb-2">Regístrate Ya</h2>
        <p className="text-gray-600">
          Prendas de calidad a buen precio. Explora nuestro catálogo y arma tu propio estilo.
        </p>
      </section>
    </div>
  )
}
