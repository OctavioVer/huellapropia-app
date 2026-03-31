"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al crear la cuenta");
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

  const isDisabled = loading || !nombre.trim() || !email.trim() || !password || !confirm;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>

        {/* Logo */}
        <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg, #CBA652, #A88B3A)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "24px", fontWeight: 800, color: "#0B1120" }}>
          HP
        </div>

        <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "6px", fontFamily: "'Source Serif 4', Georgia, serif", background: "linear-gradient(135deg, #FFFFFF, #CBA652)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Crear cuenta
        </h1>
        <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "28px" }}>
          Huella Propia · Plataforma Legislativa
        </p>

        <form onSubmit={handleRegister}>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(203, 166, 82, 0.12)", borderRadius: "16px", padding: "32px 24px" }}>

            {[
              { label: "Nombre completo", value: nombre, setter: setNombre, type: "text", placeholder: "Ej: María González" },
              { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "tu@email.com" },
              { label: "Contraseña", value: password, setter: setPassword, type: "password", placeholder: "Mínimo 8 caracteres" },
              { label: "Confirmar contraseña", value: confirm, setter: setConfirm, type: "password", placeholder: "Repetí la contraseña" },
            ].map(({ label, value, setter, type, placeholder }) => (
              <div key={label} style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 600, marginBottom: "8px" }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(2, 6, 23, 0.6)", border: "1px solid rgba(100, 116, 139, 0.2)", borderRadius: "10px", color: "#E2E8F0", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            ))}

            {error && (
              <div style={{ color: "#F87171", fontSize: "13px", marginBottom: "16px", background: "rgba(248, 113, 113, 0.08)", padding: "8px 12px", borderRadius: "8px" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isDisabled}
              style={{ width: "100%", padding: "14px", background: isDisabled ? "rgba(100, 116, 139, 0.2)" : "linear-gradient(135deg, #CBA652, #A88B3A)", color: isDisabled ? "#475569" : "#0B1120", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: isDisabled ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: isDisabled ? "none" : "0 4px 20px rgba(203, 166, 82, 0.25)", marginTop: "4px" }}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </div>
        </form>

        <p style={{ marginTop: "20px", fontSize: "13px", color: "#64748B" }}>
          ¿Ya tenés cuenta?{" "}
          <Link href="/" style={{ color: "#CBA652", textDecoration: "none", fontWeight: 600 }}>
            Ingresá aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
