import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ruler, Info } from "lucide-react"

export function DimensionsInfo() {
  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-gray-50 to-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-[#003fa2] flex items-center gap-2">
          <Ruler className="h-6 w-6 text-[#ff5500cc]" />
          Dimensiones de tu envío
        </CardTitle>
        <div className="h-1 w-16 bg-[#ff5500cc] rounded-full"></div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="h-5 w-5 text-[#003fa2] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-[#003fa2] font-medium mb-1">¿Cómo medir correctamente?</p>
            <p className="text-sm text-gray-700">
              El precio del envío dependerá de las medidas, el peso y el valor declarado ingresado, los cuales serán
              validados al momento de la recepción.
            </p>
          </div>
        </div>

        {/* Package Illustration */}
        <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300">
          <div className="relative mx-auto w-48 h-32">
            {/* 3D Box Illustration */}
            <div className="absolute inset-0">
              <svg viewBox="0 0 200 130" className="w-full h-full">
                {/* Box faces */}
                <path d="M20 40 L120 40 L140 20 L40 20 Z" fill="#f8f9fa" stroke="#003fa2" strokeWidth="2" />
                <path d="M20 40 L20 100 L120 100 L120 40 Z" fill="#ffffff" stroke="#003fa2" strokeWidth="2" />
                <path d="M120 40 L140 20 L140 80 L120 100 Z" fill="#e9ecef" stroke="#003fa2" strokeWidth="2" />

                {/* Dimension lines and labels */}
                {/* Width */}
                <line
                  x1="25"
                  y1="110"
                  x2="115"
                  y2="110"
                  stroke="#ff5500cc"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  markerStart="url(#arrowhead)"
                />
                <text x="70" y="125" textAnchor="middle" className="text-xs font-medium" fill="#ff5500cc">
                  Largo
                </text>

                {/* Height */}
                <line
                  x1="10"
                  y1="45"
                  x2="10"
                  y2="95"
                  stroke="#ff5500cc"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  markerStart="url(#arrowhead)"
                />
                <text
                  x="5"
                  y="75"
                  textAnchor="middle"
                  className="text-xs font-medium"
                  fill="#ff5500cc"
                  transform="rotate(-90 5 75)"
                >
                  Alto
                </text>

                {/* Depth */}
                <line
                  x1="125"
                  y1="35"
                  x2="145"
                  y2="15"
                  stroke="#ff5500cc"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  markerStart="url(#arrowhead)"
                />
                <text x="155" y="25" textAnchor="middle" className="text-xs font-medium" fill="#ff5500cc">
                  Ancho
                </text>

                {/* Arrow markers */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#ff5500cc" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800">Consejos para una cotización exacta:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#ff5500cc] rounded-full mt-2 flex-shrink-0"></div>
              <span>Mide el paquete ya embalado y listo para enviar</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#ff5500cc] rounded-full mt-2 flex-shrink-0"></div>
              <span>Incluye cualquier protección adicional en las medidas</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#ff5500cc] rounded-full mt-2 flex-shrink-0"></div>
              <span>El valor declarado debe corresponder al contenido real</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#ff5500cc] rounded-full mt-2 flex-shrink-0"></div>
              <span>Redondea hacia arriba si tienes dudas en las medidas</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
