import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabase } from "@/lib/supabase";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: user } = await supabase
      .from("usuarios")
      .select("id, email, nombre, password_hash")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, nombre: user.nombre });
    return NextResponse.json({ token, user: { id: user.id, email: user.email, nombre: user.nombre } });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 });
  }
}
