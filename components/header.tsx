import { Button } from "@/components/ui/button"
import { ChevronDown, Menu } from "lucide-react"

export function Header() {
  return (
    <>
      {/* Top Navigation Bar */}
      <div className="bg-[#003fa2] text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <nav className="hidden md:flex items-center space-x-6 text-sm">
              <a href="#" className="text-[#ff5500cc] font-medium">
                Personas
              </a>
              <a href="#" className="hover:text-[#ff5500cc] transition-colors">
                Emprendedores
              </a>
              <a href="#" className="hover:text-[#ff5500cc] transition-colors">
                Empresas
              </a>
              <a href="#" className="hover:text-[#ff5500cc] transition-colors">
                Internacional
              </a>
            </nav>
            <Button className="bg-[#ff5500cc] hover:bg-[#ff5500] text-white px-6 py-2 rounded-md text-sm font-medium">
              Ingresa
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-[#003fa2]">Pullman</div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-1 text-gray-700 hover:text-[#003fa2] cursor-pointer transition-colors">
                <span>Envíos</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="flex items-center space-x-1 text-gray-700 hover:text-[#003fa2] cursor-pointer transition-colors">
                <span>Red Pullman</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <a href="#" className="text-gray-700 hover:text-[#003fa2] transition-colors">
                Nuestras tarifas
              </a>
              <a href="#" className="text-gray-700 hover:text-[#003fa2] transition-colors">
                Centro de Ayuda
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
