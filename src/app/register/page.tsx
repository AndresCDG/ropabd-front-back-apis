"use client"

import { useState } from "react"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", phone: "" })
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return
      if (value.length > 10) return
    }

    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al registrar")

      setMessage(data.message || "Cuenta creada correctamente ✅")
    } catch (err: any) {
      setMessage(err.message || "Error de conexión ❌")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h1>

      {message && (
        <p
          className={`mb-4 text-center text-sm ${
            message.includes("Error") || message.includes("❌")
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="phone"
          placeholder="Teléfono (10 dígitos)"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90"
        >
          Registrarse
        </button>
      </form>
    </div>
  )
}
