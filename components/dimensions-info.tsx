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
        <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative mx-auto w-80 h-56 sm:w-96 sm:h-64 md:w-[28rem] md:h-72">
            <svg
              viewBox="-10 0 205 160"
              className="w-full h-full"
              role="img"
              aria-labelledby="box3dTitle box3dDesc"
            >
              <title id="box3dTitle">Dimensiones de una caja: Largo, Alto y Ancho</title>
              <desc id="box3dDesc">
                Ilustración isométrica de una caja con flechas para cada dimensión.
              </desc>

              <defs>
                {/* Flechas */}
                <marker
                  id="arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon points="0 0, 8 4, 0 8" fill="#ff5500cc" />
                </marker>

                {/* Sombra suave */}
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.20" />
                </filter>
              </defs>

              {/* Caja */}
              <g
                filter="url(#shadow)"
                stroke="#003fa2"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              >
                <path d="M28 48 L138 48 L158 28 L48 28 Z" fill="#f8fafc" />
                <path d="M28 48 L28 120 L138 120 L138 48 Z" fill="#ffffff" />
                <path d="M138 48 L158 28 L158 100 L138 120 Z" fill="#e5e7eb" />
              </g>

              {/* Largo */}
              <g vectorEffect="non-scaling-stroke">
                <line
                  x1="33"
                  y1="130"
                  x2="133"
                  y2="130"
                  stroke="#ff5500cc"
                  strokeWidth="2.25"
                  markerStart="url(#arrow)"
                  markerEnd="url(#arrow)"
                />
                <g transform="translate(83,144)">
                  <rect x="-28" y="-10" width="56" height="18" rx="4" fill="#ffffff" />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    className="text-[11px] md:text-xs font-medium"
                    fill="#ff5500cc"
                  >
                    Largo
                  </text>
                </g>
              </g>

              {/* Alto */}
              <g vectorEffect="non-scaling-stroke">
                <line
                  x1="18"
                  y1="53"
                  x2="18"
                  y2="115"
                  stroke="#ff5500cc"
                  strokeWidth="2.25"
                  markerStart="url(#arrow)"
                  markerEnd="url(#arrow)"
                />
                <g transform="translate(6,84) rotate(-90)">
                  <rect x="-24" y="-10" width="48" height="18" rx="4" fill="#ffffff00" />
                  <text
                    x="3"
                    y="3"
                    textAnchor="middle"
                    className="text-[11px] md:text-xs font-medium"
                    fill="#ff5500cc"
                  >
                    Alto
                  </text>
                </g>
              </g>

              {/* Ancho */}
              <g vectorEffect="non-scaling-stroke">
                <line
                  x1="142"
                  y1="42"
                  x2="165"
                  y2="21"
                  stroke="#ff5500cc"
                  strokeWidth="2.25"
                  markerStart="url(#arrow)"
                  markerEnd="url(#arrow)"
                />
                <g transform="translate(176,32)">
                  <rect x="-30" y="-10" width="60" height="18" rx="4" fill="#ffffff00" />
                  <text
                    x="8"
                    y="3"
                    textAnchor="middle"
                    className="text-[11px] md:text-xs font-medium"
                    fill="#ff5500cc"
                  >
                    Ancho
                  </text>
                </g>
              </g>
            </svg>
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
