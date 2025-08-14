import { Facebook, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white">pullman</div>
            <p className="text-gray-300 text-sm leading-relaxed">
              En Pullman tenemos capacidad de adaptación y un enfoque constante en la innovación.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Somos un operador logístico integral, capaz de brindar soluciones tecnológicas y transversales a personas,
              emprendedores y empresas a lo largo de todo Chile.
            </p>
            <p className="text-[#ff5500cc] font-semibold text-sm">¡Envía con nosotros!</p>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Información</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Conoce la empresa
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Condiciones de servicio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Código de conducta
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Privacidad de datos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Prevención de delitos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Canal de denuncia
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Accesos rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Ser cliente Empresa
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Ser Somos Partner
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Ser Soy Pullman
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  PullmanPro
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Turcargo
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Integraciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Tarifa simple
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Servicio al cliente</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Recomendaciones de embalaje
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Carga prohibida
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Carga Sobredimensionada
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Asistente WhatsApp
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#ff5500cc] transition-colors">
                  Ingresar un reclamo
                </a>
              </li>
            </ul>

            <div className="pt-4">
              <h4 className="font-medium mb-3">Síguenos en nuestras redes sociales</h4>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-400 hover:text-[#ff5500cc] transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ff5500cc] transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ff5500cc] transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ff5500cc] transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ff5500cc] transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <Button className="bg-[#ff5500cc] hover:bg-[#ff5500] text-white mt-4">Trabaja con nosotros</Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">Todos los derechos reservados 2024 Pullman</p>            
          </div>
        </div>
      </div>
    </footer>
  )
}
