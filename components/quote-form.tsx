"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package } from "lucide-react"

export function QuoteForm() {
  const [dimensions, setDimensions] = useState({
    height: "",
    width: "",
    length: "",
    weight: "",
    declaredValue: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setDimensions((prev) => ({ ...prev, [field]: value }))
  }

  const handleQuote = () => {
    // Handle quote logic here
    console.log("Cotizando...", dimensions)
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-[#003fa2] flex items-center gap-2">
          <Package className="h-6 w-6 text-[#ff5500cc]" />
          Cotiza con Pullman
        </CardTitle>
        <div className="h-1 w-16 bg-[#ff5500cc] rounded-full"></div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Datos de envío</h3>
          <p className="text-sm text-gray-600 mb-6">
            Selecciona el origen y destino de tu envío e ingresa medidas exactas, peso y valor declarado. ¡Evita
            variaciones de precio posteriores!
          </p>
        </div>

        {/* Origin and Destination */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-sm font-medium text-gray-700">
              Origen
            </Label>
            <Select>
              <SelectTrigger className="border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]">
                <SelectValue placeholder="Seleccione origen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="santiago">Santiago</SelectItem>
                <SelectItem value="valparaiso">Valparaíso</SelectItem>
                <SelectItem value="concepcion">Concepción</SelectItem>
                <SelectItem value="antofagasta">Antofagasta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
              Destino
            </Label>
            <Select>
              <SelectTrigger className="border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]">
                <SelectValue placeholder="Seleccione destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="santiago">Santiago</SelectItem>
                <SelectItem value="valparaiso">Valparaíso</SelectItem>
                <SelectItem value="concepcion">Concepción</SelectItem>
                <SelectItem value="antofagasta">Antofagasta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Dimensiones del paquete</h4>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-xs font-medium text-gray-600">
                Alto
              </Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  placeholder="0"
                  value={dimensions.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className="pr-8 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
                  cm
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="width" className="text-xs font-medium text-gray-600">
                Largo
              </Label>
              <div className="relative">
                <Input
                  id="width"
                  type="number"
                  placeholder="0"
                  value={dimensions.width}
                  onChange={(e) => handleInputChange("width", e.target.value)}
                  className="pr-8 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
                  cm
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length" className="text-xs font-medium text-gray-600">
                Ancho
              </Label>
              <div className="relative">
                <Input
                  id="length"
                  type="number"
                  placeholder="0"
                  value={dimensions.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                  className="pr-8 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
                  cm
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                Peso
              </Label>
              <div className="relative">
                <Input
                  id="weight"
                  type="number"
                  placeholder="0"
                  value={dimensions.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="pr-8 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
                  kg
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="declaredValue" className="text-sm font-medium text-gray-700">
                Valor declarado
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 bg-[#ff5500cc] text-white px-1 rounded text-xs">
                  $
                </span>
                <Input
                  id="declaredValue"
                  type="number"
                  placeholder="0"
                  value={dimensions.declaredValue}
                  onChange={(e) => handleInputChange("declaredValue", e.target.value)}
                  className="pl-8 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>100 cm = 1 metro</strong> - Asegúrate de ingresar las medidas correctas para obtener una cotización
            precisa.
          </p>
        </div>

        {/* Quote Button */}
        <Button
          onClick={handleQuote}
          className="w-full bg-[#ff5500cc] hover:bg-[#ff5500] text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          Cotizar Envío
        </Button>
      </CardContent>
    </Card>
  )
}
