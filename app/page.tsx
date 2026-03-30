"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Test the password against the API proxy
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-token": password,
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 10,
          messages: [{ role: "user", content: "test" }],
        }),
      });

      if (res.status === 401) {
        setError("Contraseña incorrecta");
        setLoading(false);
        return;
      }

      // Password works — store it
      sessionStorage.setItem("hp-token", password);
      router.push("/analisis");
    } catch (err) {
      setError("Error de conexión. Intentá de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #CBA652, #A88B3A)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: "24px",
            fontWeight: 800,
            color: "#0B1120",
          }}
        >
          HP
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "8px",
            fontFamily: "'Source Serif 4', Georgia, serif",
            background: "linear-gradient(135deg, #FFFFFF, #CBA652)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Huella Propia
        </h1>
        <p
          style={{
            color: "#64748B",
            fontSize: "14px",
            marginBottom: "32px",
          }}
        >
          Plataforma de Inteligencia Legislativa
        </p>

        <form onSubmit={handleLogin}>
          <div
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(203, 166, 82, 0.12)",
              borderRadius: "16px",
              padding: "32px 24px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "12px",
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                fontWeight: 600,
                marginBottom: "8px",
                textAlign: "left",
              }}
            >
              Contraseña de acceso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresá tu contraseña"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(2, 6, 23, 0.6)",
                border: "1px solid rgba(100, 116, 139, 0.2)",
                borderRadius: "10px",
                color: "#E2E8F0",
                fontSize: "15px",
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
                marginBottom: "16px",
                boxSizing: "border-box",
              }}
            />

            {error && (
              <div
                style={{
                  color: "#F87171",
                  fontSize: "13px",
                  marginBottom: "12px",
                  background: "rgba(248, 113, 113, 0.08)",
                  padding: "8px 12px",
                  borderRadius: "8px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password.trim()}
              style={{
                width: "100%",
                padding: "14px",
                background:
                  loading || !password.trim()
                    ? "rgba(100, 116, 139, 0.2)"
                    : "linear-gradient(135deg, #CBA652, #A88B3A)",
                color:
                  loading || !password.trim() ? "#475569" : "#0B1120",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                cursor:
                  loading || !password.trim()
                    ? "not-allowed"
                    : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow:
                  loading || !password.trim()
                    ? "none"
                    : "0 4px 20px rgba(203, 166, 82, 0.25)",
              }}
            >
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </div>
        </form>

        <p
          style={{
            marginTop: "24px",
            fontSize: "11px",
            color: "#475569",
          }}
        >
          Acceso exclusivo para clientes de Huella Propia
        </p>
      </div>
    </div>
  );
}
