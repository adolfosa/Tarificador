"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Package as PackageIcon,
  RefreshCcw,
} from "lucide-react";

/* ===================== Tipos comunes (coinciden con QuoteResult) ===================== */
export type QuoteMatch = {
  origen: string;
  destino: string;
  pesoSolicitado: number;
  bucketSeleccionado: number;
};

export type QuoteResultado = {
  tarifa_pullman_nueva: string | number;
  tipo_servicio: string;
  tipo_entrega: string;
  nombre_tarifa: string;
  fecha_compromiso: string;
  [k: string]: any;
};

export type QuoteData = {
  match: QuoteMatch;
  resultado: QuoteResultado;
};

/* ===================== Tipos locales ===================== */
type Ciudad = {
  id: number;
  ciudad_pullman: string;
  code_pullman: string;
};

type ApiRow = {
  origen: string;
  destino: string;
  peso_final?: string | number;
  peso_cotizar?: string | number;
  tarifa_pullman_nueva: string | number;
  tipo_servicio: string;
  tipo_entrega: string;
  nombre_tarifa: string;
  fecha_compromiso: string;
  [k: string]: any;
};

/* ===================== Helpers ===================== */
const toCLP = (n: number) =>
  Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);

function parsePositiveFloat(s: string): number | null {
  const n = Number(s);
  if (Number.isFinite(n) && n > 0) return n;
  return null;
}

function normalizeToQuoteData(
  payload: any,
  submitted: { origen: string; destino: string; peso: number; bucket: number }
): QuoteData {
  if (
    payload &&
    typeof payload === "object" &&
    "match" in payload &&
    "resultado" in payload
  ) {
    return payload as QuoteData;
  }

  if (Array.isArray(payload) && payload.length > 0) {
    const row: ApiRow = payload[0];

    const {
      tarifa_pullman_nueva,
      tipo_servicio,
      tipo_entrega,
      nombre_tarifa,
      fecha_compromiso,
      ...rest
    } = row;

    return {
      match: {
        origen: submitted.origen,
        destino: submitted.destino,
        pesoSolicitado: submitted.peso,
        bucketSeleccionado: submitted.bucket,
      },
      resultado: {
        ...rest,
        tarifa_pullman_nueva,
        tipo_servicio,
        tipo_entrega,
        nombre_tarifa,
        fecha_compromiso,
      },
    };
  }

  throw new Error("Respuesta de cotización inválida o vacía.");
}

/* ===================== Componente ===================== */
export function QuoteForm({
  onQuote,
}: {
  /** Si se pasa, enviamos el resultado al padre y NO renderizamos el resultado inline */
  onQuote?: (q: QuoteData) => void;
}) {
  /* ciudades */
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [loadingCiudades, setLoadingCiudades] = useState(false);
  const [ciudadesError, setCiudadesError] = useState<string | null>(null);

  /* formulario */
  const [origen, setOrigen] = useState<string>("");
  const [destino, setDestino] = useState<string>("");
  const [peso, setPeso] = useState<string>("");
  const [largo, setLargo] = useState<string>("");
  const [ancho, setAncho] = useState<string>("");
  const [alto, setAlto] = useState<string>("");
  const [declaredValue, setDeclaredValue] = useState<string>("");

  /* estado de envío */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* fallback (solo si NO hay onQuote) */
  const [localQuote, setLocalQuote] = useState<QuoteData | null>(null);

  /* ===================== Cargar ciudades ===================== */
  async function fetchCiudades() {
    setLoadingCiudades(true);
    setCiudadesError(null);
    try {
      const res = await fetch("/api/ciudades", { cache: "no-store" });
      if (!res.ok) throw new Error(`Error ${res.status} al cargar ciudades`);
      const data = (await res.json()) as Ciudad[];
      setCiudades(data);
    } catch (e: any) {
      setCiudadesError(e?.message ?? "Error al cargar ciudades");
    } finally {
      setLoadingCiudades(false);
    }
  }

  useEffect(() => {
    fetchCiudades();
  }, []);

  /* ===================== Derivados ===================== */
  const opcionesCiudades = useMemo(
    () =>
      ciudades
        .map((c) => c.ciudad_pullman)
        .sort((a, b) => a.localeCompare(b)),
    [ciudades]
  );

  const destinosFiltrados = useMemo(() => {
    if (!origen) return opcionesCiudades;
    // Evita permitir el mismo destino que el origen
    return opcionesCiudades.filter((c) => c !== origen);
  }, [origen, opcionesCiudades]);

  // Cálculo informativo de peso volumétrico (L×A×H ÷ 5000)
  const volumetrico = useMemo(() => {
    const L = parsePositiveFloat(largo) ?? 0;
    const A = parsePositiveFloat(ancho) ?? 0;
    const H = parsePositiveFloat(alto) ?? 0;
    if (L && A && H) return (L * A * H) / 5000;
    return 0;
  }, [largo, ancho, alto]);

  /* ===================== Submit ===================== */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const origenVal = origen.trim().toUpperCase();
    const destinoVal = destino.trim().toUpperCase();
    const pesoNum = parsePositiveFloat(peso);

    if (!origenVal || !destinoVal) {
      setError("Debes indicar origen y destino.");
      return;
    }
    if (!pesoNum) {
      setError("El peso debe ser un número mayor a 0.");
      return;
    }

    // permite vacío o >= 0
    const declaredValNum =
      declaredValue.trim() === "" ? null : Number(declaredValue);

    if (declaredValNum !== null && (!Number.isFinite(declaredValNum) || declaredValNum < 0)) {
      setError("El valor declarado debe ser un número mayor o igual a 0.");
      return;
    }

    // Bucket seleccionado: por ahora usamos el mismo peso declarado
    const bucket = pesoNum;

    setLoading(true);
    try {
      const res = await fetch("/api/tarifas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origen: origenVal,
          destino: destinoVal,
          peso: pesoNum,
          valor_declarado: declaredValNum ?? undefined,
        }),
        cache: "no-store",
      });
      if (!res.ok) {
        const maybe = await res.json().catch(() => null);
        throw new Error(
          maybe?.error || maybe?.message || `Error al cotizar: ${res.status}`
        );
      }
      const data = await res.json();

      const quote = normalizeToQuoteData(data, {
        origen: origenVal,
        destino: destinoVal,
        peso: pesoNum,
        bucket,
      });

      if (onQuote) {
        onQuote(quote);
      } else {
        setLocalQuote(quote);
      }
    } catch (err: any) {
      setError(err?.message || "Error inesperado al cotizar.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setOrigen("");
    setDestino("");
    setPeso("");
    setLargo("");
    setAncho("");
    setAlto("");
    setError(null);
    setLocalQuote(null);
    setDeclaredValue("");
  }

  /* ===================== Render ===================== */
  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-[#003fa2] flex items-center gap-2">
          <PackageIcon className="h-6 w-6 text-[#ff5500cc]" />
          Cotiza tu envío
        </CardTitle>     
        <p className="text-sm text-gray-600">
          Selecciona origen/destino e ingresa medidas exactas, peso y valor declarado para obtener tu cotización.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Origen / Destino */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origen">Origen</Label>
              <Select value={origen} onValueChange={setOrigen}>
                <SelectTrigger id="origen">
                  <SelectValue
                    placeholder={
                      loadingCiudades ? "Cargando…" : "Selecciona origen"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {opcionesCiudades.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <Select
                value={destino}
                onValueChange={setDestino}
                disabled={!origen || loadingCiudades || !!ciudadesError}
              >
                <SelectTrigger id="destino">
                  <SelectValue
                    placeholder={
                      !origen ? "Selecciona origen primero" : "Selecciona destino"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {destinosFiltrados.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Medidas (cm), Peso (kg) y Valor declarado ($) */}
          <div className="grid md:grid-cols-5 gap-4">
            {/* Largo */}
            <div className="space-y-2">
              <Label htmlFor="largo" className="text-sm font-medium text-gray-700">
                Largo
              </Label>
              <div className="relative">
                <Input
                  id="largo"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="0"
                  value={largo}
                  onChange={(e) => setLargo(e.target.value)}
                  className="pr-12 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
                  cm
                </span>
              </div>
            </div>

            {/* Ancho */}
            <div className="space-y-2">
              <Label htmlFor="ancho" className="text-sm font-medium text-gray-700">
                Ancho
              </Label>
              <div className="relative">
                <Input
                  id="ancho"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="0"
                  value={ancho}
                  onChange={(e) => setAncho(e.target.value)}
                  className="pr-12 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
                  cm
                </span>
              </div>
            </div>

            {/* Alto */}
            <div className="space-y-2">
              <Label htmlFor="alto" className="text-sm font-medium text-gray-700">
                Alto
              </Label>
              <div className="relative">
                <Input
                  id="alto"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="0"
                  value={alto}
                  onChange={(e) => setAlto(e.target.value)}
                  className="pr-12 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
                  cm
                </span>
              </div>
            </div>

            {/* Peso */}
            <div className="space-y-2">
              <Label htmlFor="peso" className="text-sm font-medium text-gray-700">
                Peso
              </Label>
              <div className="relative">
                <Input
                  id="peso"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="0"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  className="pr-12 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
                  kg
                </span>
              </div>
            </div>

            {/* Valor declarado */}
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
                  className="pr-12 border-gray-300 focus:border-[#ff5500cc] focus:ring-[#ff5500cc]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-100 px-1 rounded">
                  $
                </span>
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

          {/* Errores */}
          {error && (
            <p className="text-sm text-red-600 border border-red-200 bg-red-50 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              className="bg-[#003fa2] hover:bg-[#00328a] text-white"
              disabled={loading || loadingCiudades || !!ciudadesError}
            >
              {loading ? "Cotizando…" : "Cotizar"}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Limpiar
            </Button>
          </div>
        </form>

        {/* Fallback resultado inline (solo si NO hay onQuote) */}
        {!onQuote && localQuote && (
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
            <div className="text-sm text-gray-500 mb-1">
              Resultado (inline, sin onQuote)
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-500">Ruta</div>
                <div className="font-medium">
                  {localQuote.match.origen} → {localQuote.match.destino}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Peso / Bucket</div>
                <div className="font-medium">
                  {localQuote.match.pesoSolicitado} kg →{" "}
                  {localQuote.match.bucketSeleccionado} kg
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-gray-500">Tarifa</div>
                <div className="text-base font-bold">
                  {toCLP(Number(localQuote.resultado.tarifa_pullman_nueva))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}