// app/api/tarifas/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CORS preflight (si llamas desde un front distinto dominio)
export async function OPTIONS(req: Request) {
  const reqHeaders = new Headers(req.headers);
  const acrh = reqHeaders.get("Access-Control-Request-Headers") ?? "Content-Type, Authorization";

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": acrh,
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { origen, destino, peso } = body as {
      origen?: string;
      destino?: string;
      peso?: number; // peso solicitado por el usuario
    };

    // Validación básica
    origen = origen?.trim();
    destino = destino?.trim();

    if (!origen || !destino || peso === undefined || peso === null) {
      return NextResponse.json(
        { error: "Debes enviar origen, destino y peso" },
        { status: 400 }
      );
    }
    if (origen.length > 100 || destino.length > 100) {
      return NextResponse.json({ error: "Parámetros demasiado largos" }, { status: 400 });
    }
    const pesoNum = Number(peso);
    if (!Number.isFinite(pesoNum) || pesoNum <= 0) {
      return NextResponse.json({ error: "peso inválido" }, { status: 400 });
    }

    // 1) Traer los buckets reales de peso_final para ese origen/destino
    const bucketsRows = await query(
      `
      SELECT DISTINCT CAST(peso_final AS DECIMAL(10,2)) AS peso_final
      FROM pcargo_tarifas.resultado_comparacion_tarifas
      WHERE origen = ? AND destino = ?
      ORDER BY peso_final ASC
      `,
      [origen, destino]
    ) as Array<{ peso_final: number }>;

    if (!bucketsRows.length) {
      return NextResponse.json(
        { error: "No hay tarifas para ese origen/destino" },
        { status: 404 }
      );
    }

    // 2) Elegir bucket: el mínimo >= peso solicitado; si no existe, el máximo
    const buckets = bucketsRows.map(r => Number(r.peso_final)).filter(n => Number.isFinite(n));
    let targetBucket = buckets.find(b => b >= pesoNum);
    if (targetBucket === undefined) {
      targetBucket = buckets[buckets.length - 1]; // usar el mayor
    }

    // 3) Traer 1 registro del bucket elegido (el más reciente)
    const row = await query(
      `
      SELECT *
      FROM pcargo_tarifas.resultado_comparacion_tarifas
      WHERE origen = ? AND destino = ? AND peso_final = ?
      ORDER BY fecha_compromiso DESC, id DESC
      LIMIT 1
      `,
      [origen, destino, targetBucket]
    ) as any[];

    if (!row.length) {
      // (muy raro: bucket sin filas; fallback: buscar el más cercano por igualdad exacta redondeada)
      return NextResponse.json(
        {
          error: "No se encontró registro para el bucket seleccionado",
          detalle: { bucketSeleccionado: targetBucket, pesoSolicitado: pesoNum },
        },
        { status: 404 }
      );
    }

    // 4) Responder incluyendo metadatos útiles
    return NextResponse.json(
      {
        match: {
          origen,
          destino,
          pesoSolicitado: pesoNum,
          bucketSeleccionado: targetBucket,
          estrategia: "ceiling (mínimo bucket >= peso; si no hay, usa máximo)",
          disponibles: buckets, // útil para debug/UI (puedes quitarlo en prod)
        },
        resultado: row[0],
      },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (err) {
    console.error("Error al consultar resultado_comparacion_tarifas:", err);
    return NextResponse.json(
      { error: "Error al consultar tarifas" },
      { status: 500 }
    );
  }
}
