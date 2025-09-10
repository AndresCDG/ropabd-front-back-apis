import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl text-foreground">EcoShop</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Tu tienda online de confianza. Productos de calidad con envío rápido y seguro.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link href="/productos" className="block text-muted-foreground hover:text-primary transition-colors">
                Catálogo
              </Link>
              <Link href="/carrito" className="block text-muted-foreground hover:text-primary transition-colors">
                Carrito
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm">info@ecoshop.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+57 (324) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Villavicencio, Colombia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">© 2024 EcoShop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
