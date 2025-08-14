// app/api/tarifas/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export const runtime = "nodejs";          // MySQL requiere Node.js runtime (no Edge)
export const dynamic = "force-dynamic";   // Evita cachear

export async function GET() {
  try {    

    // Puedes usar "SELECT * FROM tarifas" porque el DATABASE ya es pcargo_tarifas
    const rows = await query("SELECT * FROM pcargo_tarifas.tarifas");
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("Error al consultar tarifas:", err);
    return NextResponse.json({ error: "Error al consultar tarifas" }, { status: 500 });
  }
}
