import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabase } from "@/lib/supabase";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, nombre, password } = await req.json();

    if (!email?.trim() || !nombre?.trim() || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: existing } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Este email ya está registrado" }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from("usuarios")
      .insert({ email: email.toLowerCase().trim(), nombre: nombre.trim(), password_hash })
      .select("id, email, nombre")
      .single();

    if (error) throw error;

    const token = signToken({ id: user.id, email: user.email, nombre: user.nombre });
    return NextResponse.json({ token, user: { id: user.id, email: user.email, nombre: user.nombre } });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Error al crear la cuenta" }, { status: 500 });
  }
}
