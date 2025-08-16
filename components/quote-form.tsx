"use client"

import { useEffect, useState, useCallback, useMemo, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package, RefreshCcw } from "lucide-react"

type Ciudad = {
  id: number
  ciudad_pullman: string
  code_pullman: string
}

type Indexado = {
  origenes: string[]
  destinos: string[]
  destinosByOrigen: Record<string, string[]>
}



type IndexadoCiudades = Indexado & { byName: Record<string, { id: number; code_pullman: string }> }
function normalize(s: string) {
  return s.normalize("NFKC").trim().toUpperCase()
}

function sortEs(arr: string[]) {
  return arr.sort((a, b) => a.localeCompare(b, "es"))
}

type CiudadIndex = {
  ciudades: string[]
  byName: Record<string, { id: number; code_pullman: string }>
  destinosByOrigen: Record<string, string[]>
}

/** Construye índices a partir de /api/ciudades */
function buildIndexFromCiudades(data: Ciudad[]): IndexadoCiudades {
  const ciudadesSet = new Set<string>()
  const byName: Record<string, { id: number; code_pullman: string }> = {}

  for (const c of data) {
    const name = normalize(c.ciudad_pullman)
    ciudadesSet.add(name)
    byName[name] = { id: c.id, code_pullman: c.code_pullman }
  }

  const ciudades = sortEs(Array.from(ciudadesSet))

  // Para mantener compatibilidad con el UI existente:
  // - origenes y destinos son el mismo universo de ciudades
  // - destinosByOrigen mapea cada origen a todas las ciudades (incluido el mismo)
  const destinosByOrigen: Record<string, string[]> = {}
  for (const o of ciudades) {
    destinosByOrigen[o] = ciudades
  }

  return { origenes: ciudades, destinos: ciudades, destinosByOrigen, byName }
}



/* buildIndex(Tarifa) removed after migrating to /api/ciudades */


export function QuoteForm() {
  // ---- Estados de formulario ----
  const [dimensions, setDimensions] = useState({ height: "", width: "", length: "", weight: "" })
  const [declaredValue, setDeclaredValue] = useState("")
  const [packaging, setPackaging] = useState("")
  const [heavyGoods, setHeavyGoods] = useState("")
  const [origin, setOrigin] = useState<string>("")
  const [destination, setDestination] = useState<string>("")
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [quote, setQuote] = useState<null | {
    match: { origen: string; destino: string; pesoSolicitado: number; bucketSeleccionado: number }
    resultado: any
  }>(null)

  // ---- Datos e índices (precomputados) ----
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [indexado, setIndexado] = useState<IndexadoCiudades>({ origenes: [], destinos: [], destinosByOrigen: {}, byName: {} })
  const [loadingCiudades, setLoadingCiudades] = useState<boolean>(false)
  const [ciudadesError, setCiudadesError] = useState<string | null>(null)

  const fetchCiudades = useCallback(async () => {
    setLoadingCiudades(true)
    setCiudadesError(null)
    try {
      const res = await fetch("/api/ciudades")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const data: Ciudad[] = Array.isArray(json) ? json : json?.data ?? []

      // Preindexar fuera del render para que el picker abra sin jank
      startTransition(() => {
        setCiudades(data)
        setIndexado(buildIndexFromCiudades(data))
      })
    } catch (e: any) {
      setCiudadesError(e?.message ?? "Error al cargar ciudades")
    } finally {
      setLoadingCiudades(false)
    }
  }, [])

  useEffect(() => {
    fetchCiudades()
  }, [fetchCiudades])

  // ---- Destinos en cascada por origen (sin recomputar pesado) ----
  const destinosFiltrados = useMemo(() => {
    if (!origin) return indexado.destinos
    const o = normalize(origin)
    return indexado.destinosByOrigen[o] ?? []
  }, [origin, indexado])

  // Si cambia el origen y el destino ya no es válido, limpiar destino
  useEffect(() => {
    if (destination && !destinosFiltrados.includes(normalize(destination))) {
      setDestination("")
    }
  }, [destinosFiltrados, destination])

  // ---- Handlers ----
  const handleInputChange = (field: keyof typeof dimensions, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }))
  }

  const handleQuote = async () => {
    setQuoteError(null)
    setQuote(null)

    // Validaciones básicas
    if (!origin || !destination) {
      setQuoteError("Debes seleccionar origen y destino.")
      return
    }
    const peso = Number(dimensions.weight)
    if (!Number.isFinite(peso) || peso <= 0) {
      setQuoteError("Debes ingresar un peso válido (> 0).")
      return
    }

    try {
      setQuoteLoading(true)
      const res = await fetch("/api/tarifas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origen: origin,
          destino: destination,
          peso
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setQuoteError(data?.error || `Error HTTP ${res.status}`)
        return
      }
      setQuote(data)
    } catch (e: any) {
      setQuoteError(e?.message ?? "Error de red al consultar la tarifa")
    } finally {
      setQuoteLoading(false)
    }
  }

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
        {/* Origen y destino dinámicos (preindexados) */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="origin" className="text-sm font-medium text-gray-700">
              Origen
            </Label>
            <Select
              value={origin}
              onValueChange={setOrigin}
              disabled={loadingCiudades || !!ciudadesError || indexado.origenes.length === 0}
            >
              <SelectTrigger className="border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]">
                <SelectValue placeholder={loadingCiudades ? "Cargando..." : "Seleccione origen"} />
              </SelectTrigger>
              <SelectContent>
                {indexado.origenes.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">Sin datos</div>
                )}
                {indexado.origenes.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
              Destino
            </Label>
            <Select
              value={destination}
              onValueChange={setDestination}
              disabled={loadingCiudades || !!ciudadesError || destinosFiltrados.length === 0}
            >
              <SelectTrigger className="border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]">
                <SelectValue placeholder={loadingCiudades ? "Cargando..." : "Seleccione destino"} />
              </SelectTrigger>
              <SelectContent>
                {destinosFiltrados.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    {origin ? "No hay destinos para ese origen" : "Sin datos"}
                  </div>
                )}
                {destinosFiltrados.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dimensiones */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Dimensiones del paquete</h4>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-xs font-medium text-gray-600">Alto</Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  placeholder="0"
                  value={dimensions.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className="pr-8 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="width" className="text-xs font-medium text-gray-600">Largo</Label>
              <div className="relative">
                <Input
                  id="width"
                  type="number"
                  placeholder="0"
                  value={dimensions.width}
                  onChange={(e) => handleInputChange("width", e.target.value)}
                  className="pr-8 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length" className="text-xs font-medium text-gray-600">Ancho</Label>
              <div className="relative">
                <Input
                  id="length"
                  type="number"
                  placeholder="0"
                  value={dimensions.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                  className="pr-8 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">cm</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium text-gray-700">Peso</Label>
              <div className="relative">
                <Input
                  id="weight"
                  type="number"
                  placeholder="0"
                  value={dimensions.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="pr-8 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">kg</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="declaredValue" className="text-sm font-medium text-gray-700">Valor declarado</Label>
              <div className="relative">
                <Input
                  id="declaredValue"
                  type="number"
                  placeholder="0"
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(e.target.value)}
                  className="pr-8 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">$</span>
              </div>
            </div>
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
          disabled={quoteLoading || !origin || !destination || !dimensions.weight}
          className="w-full bg-[#ff5500cc] hover:bg-[#ff5500] text-white font-medium transition-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-60"
        >
          {quoteLoading ? "Cotizando..." : "Cotizar Envío"}
        </Button>
        {quoteError && (
          <div className="mt-3 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
            {quoteError}
          </div>
        )}
        {quote && (
        <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
          <h5 className="font-semibold text-gray-800 mb-2">Cotización</h5>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-gray-500">Origen → Destino</div>
              <div className="font-medium">{quote.match.origen} → {quote.match.destino}</div>
            </div>
            <div>
              <div className="text-gray-500">Peso solicitado / Bucket</div>
              <div className="font-medium">
                {quote.match.pesoSolicitado} kg → {quote.match.bucketSeleccionado} kg
              </div>
            </div>
            <div>
              <div className="text-gray-500">Tarifa </div>
              <div className="text-lg font-bold">
                {Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" })
                  .format(Number(quote.resultado.tarifa_pullman_nueva))}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Servicio / Entrega</div>
              <div className="font-medium">
                {quote.resultado.tipo_servicio} · {quote.resultado.tipo_entrega}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Nombre tarifa</div>
              <div className="font-medium">{quote.resultado.nombre_tarifa}</div>
            </div>
            <div>
              <div className="text-gray-500">Fecha compromiso</div>
              <div className="font-medium">
                {new Date(quote.resultado.fecha_compromiso).toLocaleString("es-CL")}
              </div>
            </div>
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  )
}