completo
id,
id_pullman,
origen,
destino,
peso_final,
peso_cotizar,
tarifa_pullman_actual,
tarifa_starken_mas_barata,
tarifa_pullman_nueva,
uuid_cotizacion,
tipo_entrega,
tipo_servicio,
nombre_tarifa,
fecha_compromiso,
dias_entrega,
descuento,
tarifa_sin_descuento,
tarifa_solo_descuento,
nombre_categoria,
porcentaje_descto_segmento,
ahorro,
envio_mes,
fecha_registro

para endpoint

origen,
destino


/api/tarifas — Consultar tarifa por origen/destino y bucket de peso
Resumen

Dado un origen, destino y un peso solicitado, el endpoint:

Obtiene los buckets reales (DISTINCT peso_final) disponibles en la DB para ese par origen/destino.

Elige el bucket usando estrategia ceiling: el mínimo peso_final ≥ peso; si no existe, usa el máximo.

Devuelve 1 solo registro del bucket elegido, el más reciente (ORDER BY fecha_compromiso DESC, id DESC).

Incluye metadatos del match (bucketSeleccionado, disponibles, etc.).

Método y URL

POST /api/tarifas

CORS: Respuestas incluyen Access-Control-Allow-Origin: *. Se expone OPTIONS para preflight.

Headers

Content-Type: application/json

Body (JSON)
type TarifaRequest = {
  origen: string;     // requerido, máx 100 chars (se hace trim)
  destino: string;    // requerido, máx 100 chars (se hace trim)
  peso: number;       // requerido, > 0 (peso solicitado por el usuario)
};

Validaciones

origen y destino: requeridos, trim(), longitud ≤ 100.

peso: número finito > 0.

Comportamiento interno (algoritmo)

SELECT DISTINCT CAST(peso_final AS DECIMAL(10,2)) ... WHERE origen=? AND destino=? ORDER BY peso_final ASC

Construye arreglo buckets (números ordenados).

Ceiling: busca el primer bucket >= peso; si no hay, toma el último (máximo).

SELECT * ... WHERE origen=? AND destino=? AND peso_final=? ORDER BY fecha_compromiso DESC, id DESC LIMIT 1

Responde con:

match: metadatos del cálculo.

resultado: la fila encontrada.

Nota: Se asume que las columnas origen/destino están en collation case-insensitive (lo usual), por lo que = aprovecha índices. Si necesitas sensibilidad a mayúsculas o collation específico, ajústalo en la DB.

Respuestas
200 OK
type TarifaResponseOk = {
  match: {
    origen: string;
    destino: string;
    pesoSolicitado: number;
    bucketSeleccionado: number; // peso_final elegido
    estrategia: "ceiling (mínimo bucket >= peso; si no hay, usa máximo)";
    disponibles: number[];      // buckets reales (útil para UI/debug)
  };
  resultado: {                  // fila de pcargo_tarifas.resultado_comparacion_tarifas
    // ... todas las columnas de la tabla ...
  };
};


Ejemplo:

{
  "match": {
    "origen": "SANTIAGO",
    "destino": "IQUIQUE",
    "pesoSolicitado": 50,
    "bucketSeleccionado": 59.99,
    "estrategia": "ceiling (mínimo bucket >= peso; si no hay, usa máximo)",
    "disponibles": [1.99,5.99,7.99,9.99,14.99,19.99,29.99,39.99,59.99,79.99,99.99,499.99]
  },
  "resultado": {
    "id": 266563,
    "id_pullman": 4706,
    "origen": "SANTIAGO",
    "destino": "IQUIQUE",
    "peso_final": "59.99",
    "peso_cotizar": "50.01",
    "tarifa_pullman_actual": "73.90",
    "tarifa_starken_mas_barata": "81300.00",
    "tarifa_pullman_nueva": "77235.00",
    "uuid_cotizacion": "5f6f7072-ebc7-47a1-9668-a4ec6a2484f6",
    "tipo_entrega": "AGENCIA",
    "tipo_servicio": "NORMAL",
    "nombre_tarifa": "CORDILLERA AGENCIA NORMAL",
    "fecha_compromiso": "2025-08-18T18:21:24.000Z",
    "dias_entrega": 4,
    "descuento": 20,
    "tarifa_sin_descuento": "101630.00",
    "tarifa_solo_descuento": "33370.00",
    "nombre_categoria": "CORDILLERA",
    "porcentaje_descto_segmento": "20",
    "ahorro": "-20330.00",
    "envio_mes": "151 - ∞",
    "fecha_registro": "2025-08-14T22:21:24.000Z"
  }
}

400 Bad Request

Falta origen/destino/peso.

peso inválido (≤ 0, NaN).

Longitud de origen/destino > 100.

Ejemplo:

{ "error": "Debes enviar origen, destino y peso" }

404 Not Found

No existen tarifas para el origen/destino solicitado.

(Caso raro) No hubo fila para el bucket seleccionado.

Ejemplo:

{ "error": "No hay tarifas para ese origen/destino" }

500 Internal Server Error

Error no controlado en la consulta o ejecución.

Ejemplos de uso
cURL
curl -X POST http://localhost:3000/api/tarifas \
  -H "Content-Type: application/json" \
  -d '{"origen":"SANTIAGO","destino":"IQUIQUE","peso":50}'

Fetch (browser/Next.js)
const res = await fetch("/api/tarifas", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ origen: "SANTIAGO", destino: "IQUIQUE", peso: 50 }),
});
const data = await res.json();

Axios
import axios from "axios";
const { data } = await axios.post("/api/tarifas", {
  origen: "SANTIAGO",
  destino: "IQUIQUE",
  peso: 50,
});