"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AnalysisRecord {
  id: string;
  titulo: string;
  palabras: number;
  created_at: string;
  resultado_json: any;
}

function ImpactBadge({ type, text }: { type: string; text: string }) {
  const colors: any = {
    positive: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)", text: "#4ADE80", icon: "▲" },
    negative: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#F87171", icon: "▼" },
    neutral: { bg: "rgba(203,166,82,0.12)", border: "rgba(203,166,82,0.3)", text: "#CBA652", icon: "◆" },
  };
  const c = colors[type] || colors.neutral;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: c.bg, border: `1px solid ${c.border}`, borderRadius: "8px", padding: "6px 12px", margin: "3px", fontSize: "12px", color: c.text, fontWeight: 500 }}>
      {c.icon} {text}
    </div>
  );
}

function FullReport({ a }: { a: any }) {
  const urgColor = a.urgencia === "Alta" ? "#EF4444" : a.urgencia === "Media" ? "#F59E0B" : "#22C55E";
  const voteColor = (a.recomendacion_voto || "").includes("Acompa") ? "#4ADE80" : (a.recomendacion_voto || "").includes("Rechazar") ? "#F87171" : "#FBBF24";

  return (
    <div style={{ marginTop: "24px", borderTop: "1px solid rgba(203,166,82,0.15)", paddingTop: "24px" }}>

      {/* Header badges */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <span style={{ background: `rgba(${a.urgencia === "Alta" ? "239,68,68" : a.urgencia === "Media" ? "245,158,11" : "34,197,94"},0.12)`, color: urgColor, border: `1px solid ${urgColor}40`, padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" as const }}>
          Urgencia: {a.urgencia}
        </span>
        <span style={{ background: "rgba(203,166,82,0.1)", color: "#CBA652", border: "1px solid rgba(203,166,82,0.25)", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>
          Relevancia: {a.score_relevancia}/100
        </span>
        <span style={{ background: "rgba(100,116,139,0.1)", color: "#94A3B8", border: "1px solid rgba(100,116,139,0.2)", padding: "4px 12px", borderRadius: "6px", fontSize: "12px" }}>
          {a.tipo} · {a.comision}
        </span>
      </div>

      {[
        { title: "Resumen Ejecutivo", content: <p style={{ margin: 0 }}>{a.resumen_ejecutivo}</p> },
        {
          title: "Puntos Clave",
          content: a.puntos_clave?.map((p: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <span style={{ color: "#CBA652", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", minWidth: "22px" }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{p}</span>
            </div>
          ))
        },
        {
          title: "Análisis de Impacto",
          content: (
            <>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", color: "#4ADE80", textTransform: "uppercase" as const, letterSpacing: "1.5px", fontWeight: 700 }}>Positivos</span>
                <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap" as const }}>{a.impactos_positivos?.map((imp: string, i: number) => <ImpactBadge key={i} type="positive" text={imp} />)}</div>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#F87171", textTransform: "uppercase" as const, letterSpacing: "1.5px", fontWeight: 700 }}>Riesgos</span>
                <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap" as const }}>{a.impactos_negativos?.map((imp: string, i: number) => <ImpactBadge key={i} type="negative" text={imp} />)}</div>
              </div>
            </>
          )
        },
        { title: "Sectores Afectados", content: <div style={{ display: "flex", flexWrap: "wrap" as const }}>{a.sectores_afectados?.map((s: string, i: number) => <ImpactBadge key={i} type="neutral" text={s} />)}</div> },
        { title: "Impacto Fiscal", content: <p style={{ margin: 0 }}>{a.impacto_fiscal}</p> },
        { title: "Antecedentes Legislativos", content: <p style={{ margin: 0 }}>{a.antecedentes}</p> },
        {
          title: "Recomendación de Voto",
          content: (
            <>
              <div style={{ display: "inline-block", background: `${voteColor}22`, color: voteColor, padding: "8px 20px", borderRadius: "8px", fontSize: "16px", fontWeight: 700, border: `1px solid ${voteColor}44`, marginBottom: "12px" }}>
                {a.recomendacion_voto}
              </div>
              <p style={{ margin: "0 0 16px 0" }}>{a.justificacion_voto}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#4ADE80", textTransform: "uppercase" as const, fontWeight: 700 }}>A favor</span>
                  {a.argumentos_a_favor?.map((arg: string, i: number) => <p key={i} style={{ fontSize: "13px", color: "#94A3B8", marginTop: "6px" }}>✓ {arg}</p>)}
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#F87171", textTransform: "uppercase" as const, fontWeight: 700 }}>En contra</span>
                  {a.argumentos_en_contra?.map((arg: string, i: number) => <p key={i} style={{ fontSize: "13px", color: "#94A3B8", marginTop: "6px" }}>✗ {arg}</p>)}
                </div>
              </div>
            </>
          )
        },
        {
          title: "Modificaciones Sugeridas",
          content: a.modificaciones_sugeridas?.map((m: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <span style={{ color: "#CBA652", fontWeight: 700 }}>→</span><span>{m}</span>
            </div>
          ))
        },
      ].map(({ title, content }) => (
        <div key={title} style={{ background: "rgba(2,6,23,0.4)", border: "1px solid rgba(203,166,82,0.1)", borderRadius: "10px", padding: "18px", marginBottom: "12px" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "11px", fontWeight: 700, color: "#CBA652", textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</h4>
          <div style={{ color: "#CBD5E1", fontSize: "14px", lineHeight: 1.7, fontFamily: "'Source Serif 4', Georgia, serif" }}>{content}</div>
        </div>
      ))}
    </div>
  );
}

export default function HistorialPage() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  const getAuthHeader = () => {
    if (typeof window === "undefined") return "";
    const raw = localStorage.getItem("hp-auth");
    if (!raw) return "";
    try { return `Bearer ${JSON.parse(raw).token}`; } catch { return ""; }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("hp-auth");
    if (!raw) { router.push("/"); return; }
    try {
      const { user } = JSON.parse(raw);
      setUserName(user?.nombre || "");
    } catch {
      router.push("/");
      return;
    }

    const fetchAnalyses = async () => {
      try {
        const res = await fetch("/api/analyses", {
          headers: { Authorization: getAuthHeader() },
        });
        if (res.status === 401) { router.push("/"); return; }
        const data = await res.json();
        setAnalyses(data.analyses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este análisis?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/analyses/${id}`, {
        method: "DELETE",
        headers: { Authorization: getAuthHeader() },
      });
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("hp-auth");
    router.push("/");
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("es-AR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const urgColor = (u: string) => u === "Alta" ? "#EF4444" : u === "Media" ? "#F59E0B" : "#22C55E";

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Nav */}
      <div style={{ background: "rgba(15,23,42,0.9)", borderBottom: "1px solid rgba(203,166,82,0.12)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #CBA652, #A88B3A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800, color: "#0B1120" }}>HP</div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#F1F5F9" }}>Mi Historial</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {userName && <span style={{ fontSize: "13px", color: "#64748B" }}>{userName}</span>}
          <button onClick={() => router.push("/analisis")} style={{ background: "rgba(203,166,82,0.1)", border: "1px solid rgba(203,166,82,0.2)", color: "#CBA652", fontSize: "12px", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>
            + Nuevo análisis
          </button>
          <button onClick={logout} style={{ background: "rgba(100,116,139,0.15)", border: "1px solid rgba(100,116,139,0.25)", color: "#94A3B8", fontSize: "12px", padding: "6px 14px", borderRadius: "8px", cursor: "pointer" }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "36px 20px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 700, margin: "0 0 8px 0", fontFamily: "'Source Serif 4', Georgia, serif", background: "linear-gradient(135deg, #FFFFFF, #CBA652)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Historial de Análisis
          </h1>
          <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>
            {analyses.length > 0 ? `${analyses.length} análisis realizados` : "Todos tus análisis guardados"}
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#CBA652" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid rgba(203,166,82,0.15)", borderTop: "3px solid #CBA652", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: "14px" }}>Cargando historial...</p>
          </div>
        )}

        {!loading && analyses.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(203,166,82,0.1)", borderRadius: "16px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <h3 style={{ color: "#F1F5F9", fontSize: "18px", marginBottom: "8px" }}>Todavía no tenés análisis</h3>
            <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "24px" }}>
              Analizá tu primer proyecto de ley para verlo acá.
            </p>
            <button onClick={() => router.push("/analisis")} style={{ background: "linear-gradient(135deg, #CBA652, #A88B3A)", color: "#0B1120", border: "none", borderRadius: "10px", padding: "12px 28px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
              Analizar proyecto →
            </button>
          </div>
        )}

        {!loading && analyses.map((record) => {
          const a = record.resultado_json;
          const isExpanded = expandedId === record.id;

          return (
            <div
              key={record.id}
              style={{ background: "rgba(15,23,42,0.7)", border: `1px solid ${isExpanded ? "rgba(203,166,82,0.35)" : "rgba(203,166,82,0.12)"}`, borderRadius: "14px", padding: "22px 24px", marginBottom: "14px", transition: "border-color 0.2s" }}
            >
              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "17px", fontWeight: 700, color: "#F1F5F9", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {a?.titulo || record.titulo}
                  </h3>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                    {a?.urgencia && (
                      <span style={{ background: `${urgColor(a.urgencia)}18`, color: urgColor(a.urgencia), border: `1px solid ${urgColor(a.urgencia)}44`, padding: "2px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const }}>
                        {a.urgencia}
                      </span>
                    )}
                    {a?.score_relevancia && (
                      <span style={{ color: "#CBA652", fontSize: "12px", fontWeight: 600 }}>
                        ★ {a.score_relevancia}/100
                      </span>
                    )}
                    {a?.tipo && <span style={{ color: "#64748B", fontSize: "12px" }}>{a.tipo}</span>}
                    <span style={{ color: "#475569", fontSize: "12px" }}>
                      {formatDate(record.created_at)}
                    </span>
                    {record.palabras > 0 && (
                      <span style={{ color: "#475569", fontSize: "12px" }}>{record.palabras} palabras</span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                    style={{ background: isExpanded ? "rgba(203,166,82,0.15)" : "rgba(203,166,82,0.08)", border: "1px solid rgba(203,166,82,0.25)", color: "#CBA652", fontSize: "12px", padding: "7px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
                  >
                    {isExpanded ? "↑ Cerrar" : "Ver informe"}
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    disabled={deletingId === record.id}
                    style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171", fontSize: "12px", padding: "7px 12px", borderRadius: "8px", cursor: deletingId === record.id ? "not-allowed" : "pointer", opacity: deletingId === record.id ? 0.5 : 1 }}
                  >
                    {deletingId === record.id ? "..." : "🗑️"}
                  </button>
                </div>
              </div>

              {/* Executive summary preview */}
              {!isExpanded && a?.resumen_ejecutivo && (
                <p style={{ margin: "12px 0 0 0", fontSize: "13px", color: "#94A3B8", lineHeight: 1.6, fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {a.resumen_ejecutivo.length > 180 ? a.resumen_ejecutivo.substring(0, 180) + "..." : a.resumen_ejecutivo}
                </p>
              )}

              {/* Full report */}
              {isExpanded && a && <FullReport a={a} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
