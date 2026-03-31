import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getTokenFromRequest } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getTokenFromRequest(req);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = getSupabase();
  const { error } = await supabase
    .from("analisis")
    .delete()
    .eq("id", params.id)
    .eq("usuario_id", user.id);

  if (error) return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  return NextResponse.json({ success: true });
}
