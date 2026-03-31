import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Aceptar JWT (Authorization: Bearer <token>) o APP_PASSWORD legacy (x-app-token)
  const bearerToken = req.headers.get("Authorization")?.split(" ")[1];
  const legacyToken = req.headers.get("x-app-token");

  const authorized =
    (bearerToken && !!verifyToken(bearerToken)) ||
    (legacyToken && legacyToken === process.env.APP_PASSWORD);

  if (!authorized) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key no configurada en el servidor" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    // Validar que no manden cosas raras
    const { model, max_tokens, system, messages } = body;
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Formato de mensaje inválido" },
        { status: 400 }
      );
    }

    // Llamar a la API de Anthropic desde el servidor
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-20250514",
        max_tokens: Math.min(max_tokens || 4000, 8000), // Limitar tokens
        system: system || undefined,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Error en la API de Anthropic" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error en proxy:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
