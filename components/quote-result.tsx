import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt } from "lucide-react"

export type QuoteMatch = {
  origen: string
  destino: string
  pesoSolicitado: number
  bucketSeleccionado: number
}

export type QuoteResultado = {
  tarifa_pullman_nueva: string | number
  tipo_servicio: string
  tipo_entrega: string
  nombre_tarifa: string
  fecha_compromiso: string
  [k: string]: any
}

export type QuoteData = {
  match: QuoteMatch
  resultado: QuoteResultado
}

export function QuoteResult({ quote }: { quote: QuoteData | null }) {
  if (!quote) {
    return (
      <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-gray-50 to-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-[#003fa2] flex items-center gap-2">
            <Receipt className="h-6 w-6 text-[#ff5500cc]" />
            Resultado de la cotización
          </CardTitle>          
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Completa el formulario de la izquierda y presiona <span className="font-medium">Cotizar</span> para ver aquí el detalle.
          </p>
        </CardContent>
      </Card>
    )
  }

  const monto = Number(quote.resultado.tarifa_pullman_nueva)

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-gray-50 to-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-[#003fa2] flex items-center gap-2">
          <Receipt className="h-6 w-6 text-[#ff5500cc]" />
          Resultado de la cotización
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
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
            <div className="text-gray-500">Tarifa</div>
            <div className="text-lg font-bold">
              {Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(monto)}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Servicio / Entrega</div>
            <div className="font-medium">
              {quote.resultado.tipo_servicio} · {quote.resultado.tipo_entrega}
            </div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-gray-500">Nombre tarifa</div>
            <div className="font-medium">{quote.resultado.nombre_tarifa}</div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-gray-500">Fecha compromiso</div>
            <div className="font-medium">
              {new Date(quote.resultado.fecha_compromiso).toLocaleString("es-CL")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
