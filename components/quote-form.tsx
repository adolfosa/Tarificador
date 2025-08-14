"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package, RefreshCcw } from "lucide-react"

type Tarifa = any // <- tipa según tus columnas reales si quieres

export function QuoteForm() {
  // ---- Estados de formulario (mantén los nombres como los tenías) ----
  const [dimensions, setDimensions] = useState({
    height: "",
    width: "",
    length: "",
    weight: "",
  })
  const [declaredValue, setDeclaredValue] = useState("")
  const [packaging, setPackaging] = useState("")
  const [heavyGoods, setHeavyGoods] = useState("")
  const [origin, setOrigin] = useState<string>("")
  const [destination, setDestination] = useState<string>("")

  // ---- Estados para tarifas (fetch al cargar la página) ----
  const [tarifas, setTarifas] = useState<Tarifa[]>([])
  const [loadingTarifas, setLoadingTarifas] = useState<boolean>(false)
  const [tarifasError, setTarifasError] = useState<string | null>(null)

  const fetchTarifas = useCallback(async () => {
    setLoadingTarifas(true)
    setTarifasError(null)
    try {
      const res = await fetch("/api/tarifas", { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setTarifas(Array.isArray(json) ? json : json?.data ?? [])
    } catch (e: any) {
      setTarifasError(e?.message ?? "Error al cargar tarifas")
    } finally {
      setLoadingTarifas(false)
    }
  }, [])

  useEffect(() => {
    // 👉 carga automática al montar
    fetchTarifas()
  }, [fetchTarifas])

  // ---- Handlers de formulario (mantén tu lógica) ----
  const handleInputChange = (field: keyof typeof dimensions, value: string) => {
    setDimensions((prev) => ({ ...prev, [field]: value }))
  }

  const handleQuote = () => {
    // aquí va tu lógica de cotización (usa dimensiones, declaredValue, packaging, heavyGoods, origin, destination, y si quieres tarifas)
    console.log({
      origin,
      destination,
      dimensions,
      declaredValue,
      packaging,
      heavyGoods,
      tarifasCount: tarifas.length,
    })
    // TODO: implementar tu flujo real de cotización
  }

  // (Opcional) derivar ciudades únicas desde tarifas si tu tabla las trae
  // const ciudades = Array.from(new Set(tarifas.map(t => t.ciudad))).sort()

  return (
    <Card className="max-w-3xl mx-auto border-gray-200 shadow-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-[#ff5500]" />
          <CardTitle className="text-2xl font-bold text-[#003fa3]">Cotiza tu Envío</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          Selecciona origen/destino e ingresa medidas exactas, peso y valor declarado para obtener tu cotización.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">  
      {/* Origen y destino */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-sm font-medium text-gray-700">
              Origen
            </Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]">
                <SelectValue placeholder="Seleccione origen" />
              </SelectTrigger>
              <SelectContent>
                {/* Si luego quieres mapear desde tarifas, reemplaza estas opciones */}
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
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]">
                <SelectValue placeholder="Seleccione destino" />
              </SelectTrigger>
              <SelectContent>
                {/* Idem, reemplaza por datos reales si viene desde tarifas */}
                <SelectItem value="santiago">Santiago</SelectItem>
                <SelectItem value="valparaiso">Valparaíso</SelectItem>
                <SelectItem value="concepcion">Concepción</SelectItem>
                <SelectItem value="antofagasta">Antofagasta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dimensiones */}
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
                <Input
                  id="declaredValue"
                  type="number"
                  placeholder="0"
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(e.target.value)}
                  className="pr-8 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
                  $
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Embalaje y carga */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="packaging" className="text-sm font-medium text-gray-700">
              Embalaje
            </Label>
            <Select value={packaging} onValueChange={setPackaging}>
              <SelectTrigger className="border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]">
                <SelectValue placeholder="Seleccione tipo de embalaje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="caja">Caja</SelectItem>
                <SelectItem value="bolsa">Bolsa</SelectItem>
                <SelectItem value="pallet">Pallet</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heavyGoods" className="text-sm font-medium text-gray-700">
              ¿Mercancía pesada?
            </Label>
            <Select value={heavyGoods} onValueChange={setHeavyGoods}>
              <SelectTrigger className="border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="si">Sí</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Info Alert */}
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>100 cm = 1 metro</strong> — Ingresa medidas correctas para una cotización precisa.
          </p>
        </div>

        {/* Botón de cotizar */}
        <Button
          onClick={handleQuote}
          className="w-full bg-[#ff5500cc] hover:bg-[#ff5500] text-white font-medium transition-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          Cotizar Envío
        </Button>
      </CardContent>
    </Card>
  )
}
