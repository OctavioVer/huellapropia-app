import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getTokenFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getTokenFromRequest(req);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("analisis")
    .select("id, titulo, palabras, created_at, resultado_json")
    .eq("usuario_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Error al obtener análisis" }, { status: 500 });
  return NextResponse.json({ analyses: data });
}

export async function POST(req: NextRequest) {
  const user = getTokenFromRequest(req);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const { titulo, texto_proyecto, resultado_json, palabras } = await req.json();

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("analisis")
      .insert({
        usuario_id: user.id,
        titulo: titulo || "Sin título",
        texto_proyecto,
        resultado_json,
        palabras: palabras || 0,
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ id: data.id });
  } catch (err: any) {
    console.error("Save analysis error:", err);
    return NextResponse.json({ error: "Error al guardar análisis" }, { status: 500 });
  }
}
