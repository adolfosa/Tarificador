// app/api/ciudades/route.ts
import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export const runtime = "nodejs";        
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await query("SELECT * FROM pcargo_tarifas.mapeo_ciudades");
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("Error al consultar mapeo_ciudades:", err);
    return NextResponse.json(
      { error: "Error al consultar mapeo_ciudades" },
      { status: 500 }
    );
  }
}
