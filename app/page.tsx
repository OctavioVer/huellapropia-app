"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      localStorage.setItem("hp-auth", JSON.stringify({ token: data.token, user: data.user }));
      router.push("/analisis");
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    }
    setLoading(false);
  };

  const isDisabled = loading || !email.trim() || !password.trim();

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>

        {/* Logo */}
        <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg, #CBA652, #A88B3A)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "24px", fontWeight: 800, color: "#0B1120" }}>
          HP
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px", fontFamily: "'Source Serif 4', Georgia, serif", background: "linear-gradient(135deg, #FFFFFF, #CBA652)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Huella Propia
        </h1>
        <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "32px" }}>
          Plataforma de Inteligencia Legislativa
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(203, 166, 82, 0.12)", borderRadius: "16px", padding: "32px 24px" }}>

            <div style={{ marginBottom: "16px", textAlign: "left" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600, marginBottom: "8px" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                style={{ width: "100%", padding: "12px 16px", background: "rgba(2, 6, 23, 0.6)", border: "1px solid rgba(100, 116, 139, 0.2)", borderRadius: "10px", color: "#E2E8F0", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "20px", textAlign: "left" }}>
              <label style={{ display: "block", fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600, marginBottom: "8px" }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                style={{ width: "100%", padding: "12px 16px", background: "rgba(2, 6, 23, 0.6)", border: "1px solid rgba(100, 116, 139, 0.2)", borderRadius: "10px", color: "#E2E8F0", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {error && (
              <div style={{ color: "#F87171", fontSize: "13px", marginBottom: "16px", background: "rgba(248, 113, 113, 0.08)", padding: "8px 12px", borderRadius: "8px" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isDisabled}
              style={{ width: "100%", padding: "14px", background: isDisabled ? "rgba(100, 116, 139, 0.2)" : "linear-gradient(135deg, #CBA652, #A88B3A)", color: isDisabled ? "#475569" : "#0B1120", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: isDisabled ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: isDisabled ? "none" : "0 4px 20px rgba(203, 166, 82, 0.25)" }}
            >
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </div>
        </form>

        <p style={{ marginTop: "20px", fontSize: "13px", color: "#64748B" }}>
          ¿No tenés cuenta?{" "}
          <Link href="/registro" style={{ color: "#CBA652", textDecoration: "none", fontWeight: 600 }}>
            Registrate aquí
          </Link>
        </p>

        <p style={{ marginTop: "16px", fontSize: "11px", color: "#475569" }}>
          Acceso exclusivo para clientes de Huella Propia
        </p>
      </div>
    </div>
  );
}
