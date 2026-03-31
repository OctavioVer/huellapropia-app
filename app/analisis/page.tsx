"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SAMPLE_BILL = `PROYECTO DE LEY - RÉGIMEN DE PROMOCIÓN DE LA ECONOMÍA DEL CONOCIMIENTO

ARTÍCULO 1°.- Objeto. La presente ley tiene por objeto promocionar actividades económicas que apliquen el uso del conocimiento y la digitalización de la información apoyado en los avances de la ciencia y de las tecnologías, a la obtención de bienes, prestación de servicios y/o mejoras de procesos.

ARTÍCULO 2°.- Actividades Promovidas. Quedan comprendidas dentro del régimen establecido por la presente ley las siguientes actividades:
a) Software y servicios informáticos y digitales.
b) Producción y postproducción audiovisual, incluidos los videojuegos.
c) Biotecnología, bioeconomía, biología, bioquímica, microbiología, bioinformática.
d) Servicios geológicos y de prospección, y servicios relacionados con la electrónica y las comunicaciones.
e) Servicios profesionales de exportación: jurídicos, de contabilidad y auditoría, consultoría empresarial, arquitectura e ingeniería.
f) Nanotecnología y nanociencia.
g) Industria aeroespacial y satelital, tecnologías espaciales.
h) Inteligencia artificial, robótica e Internet de las Cosas.

ARTÍCULO 3°.- Beneficiarios. Podrán acceder al régimen de la presente ley las personas jurídicas constituidas en la República Argentina o habilitadas para actuar dentro de su territorio con ajuste a sus leyes que desarrollen en el país, por cuenta propia y como actividad principal, alguna de las actividades mencionadas en el artículo 2°.

ARTÍCULO 4°.- Requisitos. Para gozar de los beneficios establecidos en la presente ley, los beneficiarios deberán cumplir con al menos dos de las siguientes condiciones:
a) Acreditación de normas de calidad reconocidas.
b) Inversiones en investigación y desarrollo en un porcentaje mínimo del 3% de su facturación.
c) Inversiones en capacitación de empleados en un porcentaje mínimo del 8% de la masa salarial.

ARTÍCULO 5°.- Beneficios fiscales. Los beneficiarios del presente régimen gozarán de:
a) Estabilidad fiscal por el término de DIEZ (10) años.
b) Reducción del impuesto a las ganancias en un 60% para micro y pequeñas empresas, y un 40% para medianas empresas.
c) Bono de crédito fiscal transferible equivalente al 70% de las contribuciones patronales.
d) Retención del 0% en el impuesto al valor agregado para exportaciones de servicios.

ARTÍCULO 6°.- Fondo Fiduciario. Créase el Fondo Fiduciario para la Promoción de la Economía del Conocimiento (FONPEC) con el objeto de financiar proyectos de capacitación, infraestructura tecnológica e incubación de emprendimientos.

ARTÍCULO 7°.- Autoridad de Aplicación. El Ministerio de Economía será la autoridad de aplicación de la presente ley.

ARTÍCULO 8°.- Sanciones. El incumplimiento de las obligaciones dará lugar a la aplicación de multas, suspensión temporal o exclusión del régimen.

ARTÍCULO 9°.- Comuníquese al Poder Ejecutivo.`;

function AnalysisSection({ icon, title, children, delay }: { icon: string; title: string; children: React.ReactNode; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(203,166,82,0.15)", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <span style={{ fontSize: "20px" }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#CBA652", textTransform: "uppercase", letterSpacing: "1.5px" }}>{title}</h3>
      </div>
      <div style={{ color: "#CBD5E1", fontSize: "15px", lineHeight: 1.75, fontFamily: "'Source Serif 4', Georgia, serif" }}>{children}</div>
    </div>
  );
}

function ImpactBadge({ type, text }: { type: string; text: string }) {
  const colors: any = {
    positive: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)", text: "#4ADE80", icon: "▲" },
    negative: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#F87171", icon: "▼" },
    neutral: { bg: "rgba(203,166,82,0.12)", border: "rgba(203,166,82,0.3)", text: "#CBA652", icon: "◆" },
  };
  const c = colors[type] || colors.neutral;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: c.bg, border: `1px solid ${c.border}`, borderRadius: "8px", padding: "8px 14px", margin: "4px", fontSize: "13px", color: c.text, fontWeight: 500 }}>
      <span>{c.icon}</span> {text}
    </div>
  );
}

export default function AnalisisPage() {
  const [billText, setBillText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("hp-auth");
    if (!raw) { router.push("/"); return; }
    try {
      const { user } = JSON.parse(raw);
      setUserName(user?.nombre || "");
    } catch {
      router.push("/");
    }
  }, [router]);

  const getAuthHeader = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    const raw = localStorage.getItem("hp-auth");
    if (!raw) return {};
    try { return { Authorization: `Bearer ${JSON.parse(raw).token}` }; } catch { return {}; }
  };

  const analyzeProject = async () => {
    if (!billText.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    const systemPrompt = `Eres un analista legislativo experto de Argentina. Tu trabajo es analizar proyectos de ley y generar informes ejecutivos claros y accionables para legisladores.

Responde UNICAMENTE con un JSON valido (sin backticks, sin markdown, sin texto adicional). El JSON debe tener esta estructura exacta:

{
  "titulo": "Nombre corto del proyecto",
  "tipo": "Ley / Resolucion / Decreto / etc.",
  "comision": "Comision probable de tratamiento",
  "urgencia": "Alta / Media / Baja",
  "resumen_ejecutivo": "Resumen de 3-4 oraciones del proyecto",
  "puntos_clave": ["punto 1", "punto 2", "punto 3", "punto 4", "punto 5"],
  "impactos_positivos": ["impacto 1", "impacto 2", "impacto 3"],
  "impactos_negativos": ["riesgo 1", "riesgo 2", "riesgo 3"],
  "sectores_afectados": ["sector 1", "sector 2", "sector 3"],
  "antecedentes": "Legislacion existente relacionada y contexto",
  "recomendacion_voto": "Acompañar / Acompañar con modificaciones / Rechazar / Abstencion",
  "justificacion_voto": "Explicacion de por que se recomienda esa posicion",
  "argumentos_a_favor": ["argumento 1", "argumento 2"],
  "argumentos_en_contra": ["argumento 1", "argumento 2"],
  "modificaciones_sugeridas": ["modificacion 1", "modificacion 2"],
  "impacto_fiscal": "Estimacion del impacto en el presupuesto",
  "score_relevancia": 85
}`;

    try {
      // Llama al proxy seguro en vez de a Anthropic directo
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: `Analiza el siguiente proyecto de ley y genera el informe ejecutivo en JSON:\n\n${billText}` }],
        }),
      });

      if (response.status === 401) {
        router.push("/");
        return;
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const text = data.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
      const cleaned = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      setAnalysis(parsed);
      setSaved(false);

      // Guardar automáticamente en el historial
      try {
        await fetch("/api/analyses", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
          body: JSON.stringify({
            titulo: parsed.titulo,
            texto_proyecto: billText,
            resultado_json: parsed,
            palabras: billText.split(/\s+/).filter(Boolean).length,
          }),
        });
        setSaved(true);
      } catch {
        // No bloqueamos la UI si falla el guardado
      }
    } catch (err: any) {
      setError(err.message.includes("JSON") ? "Error procesando la respuesta. Intentá nuevamente." : `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    if (!analysis) return;
    setExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF("p", "mm", "a4");
      const W = 210, M = 18, CW = W - M * 2;
      let y = 0;
      const GOLD: [number,number,number] = [203,166,82], DARK_BG: [number,number,number] = [15,20,35], HEADER_BG: [number,number,number] = [20,28,50], WHITE: [number,number,number] = [240,244,248], LGRAY: [number,number,number] = [160,174,192], GREEN: [number,number,number] = [74,222,128], RED: [number,number,number] = [248,113,113], AMBER: [number,number,number] = [251,191,36];
      const pageSetup = () => { doc.setFillColor(...DARK_BG); doc.rect(0,0,W,297,"F"); doc.setFillColor(...GOLD); doc.rect(0,293,W,4,"F"); };
      const checkPage = (h: number) => { if (y+h>280) { doc.addPage(); pageSetup(); y=18; } };
      const sectionTitle = (t: string) => { checkPage(16); y+=4; doc.setDrawColor(...GOLD); doc.setLineWidth(0.4); doc.line(M,y,M+CW,y); y+=7; doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...GOLD); doc.text(t.toUpperCase(),M,y); y+=7; };
      const writeText = (t: string, opts: any = {}) => { doc.setFont("helvetica",opts.bold?"bold":"normal"); doc.setFontSize(opts.size||9.5); doc.setTextColor(...(opts.color||WHITE)); const lines = doc.splitTextToSize(String(t||""),CW-(opts.indent||0)); lines.forEach((l: string) => { checkPage(5); doc.text(l,M+(opts.indent||0),y); y+=4.5; }); y+=2; };
      const writeBullets = (items: string[], opts: any = {}) => { const { marker="•" } = opts; (items||[]).forEach((item,i) => { const prefix = marker==="num"?`${i+1}.`:marker; checkPage(6); doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(...(opts.markerColor||GOLD)); doc.text(prefix,M+2,y); doc.setFont("helvetica","normal"); doc.setTextColor(...(opts.color||WHITE)); const lines = doc.splitTextToSize(String(item),CW-12); lines.forEach((l: string) => { checkPage(5); doc.text(l,M+10,y); y+=4.5; }); y+=1.5; }); y+=2; };

      pageSetup();
      doc.setFillColor(...HEADER_BG); doc.rect(0,0,W,70,"F");
      doc.setFillColor(...GOLD); doc.rect(0,0,W,2.5,"F"); doc.rect(M,14,2,35,"F");
      y=20; doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...GOLD); doc.text("INFORME EJECUTIVO LEGISLATIVO",M+8,y);
      y+=12; doc.setFontSize(19); doc.setTextColor(...WHITE); const tLines = doc.splitTextToSize(String(analysis.titulo||""),CW-10); tLines.forEach((l: string) => { doc.text(l,M+8,y); y+=9; });
      y=58; doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(...LGRAY); doc.text(`Tipo: ${analysis.tipo||"-"}  |  Comision: ${analysis.comision||"-"}`,M+8,y); y+=5;
      const urgCol = analysis.urgencia==="Alta"?RED:analysis.urgencia==="Media"?AMBER:GREEN;
      doc.setTextColor(...urgCol); doc.setFont("helvetica","bold"); doc.text(`Urgencia: ${(analysis.urgencia||"-").toUpperCase()}`,M+8,y); doc.setTextColor(...GOLD); doc.text(`Relevancia: ${analysis.score_relevancia||"-"}/100`,M+60,y);
      const now = new Date(); doc.setTextColor(...LGRAY); doc.setFont("helvetica","normal"); doc.text(`Generado: ${now.toLocaleDateString("es-AR")}`,M+120,y);
      y=80;
      sectionTitle("Resumen Ejecutivo"); writeText(analysis.resumen_ejecutivo);
      sectionTitle("Puntos Clave"); writeBullets(analysis.puntos_clave,{marker:"num",markerColor:GOLD});
      sectionTitle("Analisis de Impacto");
      doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...GREEN); checkPage(6); doc.text("IMPACTOS POSITIVOS",M,y); y+=5; writeBullets(analysis.impactos_positivos,{marker:"+",markerColor:GREEN});
      doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...RED); checkPage(6); doc.text("RIESGOS",M,y); y+=5; writeBullets(analysis.impactos_negativos,{marker:"-",markerColor:RED});
      sectionTitle("Sectores Afectados"); writeBullets(analysis.sectores_afectados,{marker:"◆",markerColor:GOLD});
      sectionTitle("Impacto Fiscal"); writeText(analysis.impacto_fiscal);
      sectionTitle("Antecedentes Legislativos"); writeText(analysis.antecedentes);
      sectionTitle("Recomendacion de Voto"); checkPage(16);
      const vCol = (analysis.recomendacion_voto||"").includes("Acompa")?GREEN:(analysis.recomendacion_voto||"").includes("Rechazar")?RED:AMBER;
      doc.setFillColor(...vCol); doc.roundedRect(M,y-4,55,10,2,2,"F"); doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...DARK_BG); doc.text((analysis.recomendacion_voto||"").toUpperCase(),M+3,y+3); y+=14;
      writeText(analysis.justificacion_voto);
      doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...GREEN); checkPage(6); doc.text("ARGUMENTOS A FAVOR",M,y); y+=5; writeBullets(analysis.argumentos_a_favor,{marker:"+",markerColor:GREEN});
      doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...RED); checkPage(6); doc.text("ARGUMENTOS EN CONTRA",M,y); y+=5; writeBullets(analysis.argumentos_en_contra,{marker:"-",markerColor:RED});
      sectionTitle("Modificaciones Sugeridas"); writeBullets(analysis.modificaciones_sugeridas,{marker:"→",markerColor:GOLD});
      const pages = doc.internal.getNumberOfPages();
      for (let i=1; i<=pages; i++) { doc.setPage(i); doc.setFontSize(6.5); doc.setFont("helvetica","normal"); doc.setTextColor(...LGRAY); doc.text("Huella Propia · Analisis Legislativo Inteligente",M,289); doc.text(`Pag. ${i}/${pages}`,W-M-14,289); }
      const safeName = (analysis.titulo||"Informe").replace(/[^a-zA-Z0-9\u00C0-\u017F ]/g,"").replace(/\s+/g,"_").substring(0,40);
      doc.save(`Informe_${safeName}_${now.toISOString().split("T")[0]}.pdf`);
    } catch (err) { console.error(err); }
    setExporting(false);
  };

  const urgencyColor = (u: string) => u === "Alta" ? "#EF4444" : u === "Media" ? "#F59E0B" : "#22C55E";

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Nav */}
      <div style={{ background: "rgba(15,23,42,0.9)", borderBottom: "1px solid rgba(203,166,82,0.12)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #CBA652, #A88B3A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800, color: "#0B1120" }}>HP</div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#F1F5F9" }}>Análisis Legislativo</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {userName && <span style={{ fontSize: "13px", color: "#64748B" }}>{userName}</span>}
          <Link href="/historial" style={{ background: "rgba(203,166,82,0.08)", border: "1px solid rgba(203,166,82,0.2)", color: "#CBA652", fontSize: "12px", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, textDecoration: "none" }}>
            Historial
          </Link>
          <button onClick={() => { localStorage.removeItem("hp-auth"); router.push("/"); }} style={{ background: "rgba(100,116,139,0.15)", border: "1px solid rgba(100,116,139,0.25)", color: "#94A3B8", fontSize: "12px", padding: "6px 14px", borderRadius: "8px", cursor: "pointer" }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "36px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 700, margin: "0 0 10px 0", fontFamily: "'Source Serif 4', Georgia, serif", background: "linear-gradient(135deg, #FFFFFF, #CBA652)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.2 }}>
            Análisis Inteligente de Proyectos de Ley
          </h1>
          <p style={{ color: "#64748B", fontSize: "15px" }}>Pegá el texto de cualquier proyecto y obtené un informe ejecutivo en segundos.</p>
        </div>

        {/* Input */}
        {!analysis && (
          <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(203,166,82,0.12)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>Texto del Proyecto</label>
              <button onClick={() => { setBillText(SAMPLE_BILL); }} style={{ background: "rgba(203,166,82,0.1)", border: "1px solid rgba(203,166,82,0.25)", color: "#CBA652", fontSize: "12px", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}>Cargar ejemplo</button>
            </div>
            <textarea value={billText} onChange={(e) => setBillText(e.target.value)} placeholder="Pegá aquí el texto completo del proyecto de ley..." style={{ width: "100%", minHeight: "220px", background: "rgba(2,6,23,0.6)", border: "1px solid rgba(100,116,139,0.2)", borderRadius: "10px", padding: "16px", color: "#CBD5E1", fontSize: "14px", lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
              <span style={{ fontSize: "12px", color: "#475569" }}>{billText.length > 0 ? `${billText.split(/\s+/).filter(Boolean).length} palabras` : ""}</span>
              <button onClick={analyzeProject} disabled={loading || !billText.trim()} style={{ background: loading || !billText.trim() ? "rgba(100,116,139,0.2)" : "linear-gradient(135deg, #CBA652, #A88B3A)", color: loading || !billText.trim() ? "#475569" : "#0B1120", border: "none", borderRadius: "10px", padding: "14px 32px", fontSize: "14px", fontWeight: 700, cursor: loading || !billText.trim() ? "not-allowed" : "pointer", boxShadow: loading || !billText.trim() ? "none" : "0 4px 20px rgba(203,166,82,0.25)" }}>
                {loading ? "⏳ Analizando..." : "Analizar proyecto →"}
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "48px 20px", color: "#CBA652" }}>
            <div style={{ width: "48px", height: "48px", border: "3px solid rgba(203,166,82,0.15)", borderTop: "3px solid #CBA652", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: "15px", fontWeight: 500 }}>Procesando proyecto de ley...</p>
          </div>
        )}

        {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "12px", padding: "20px", color: "#F87171", fontSize: "14px", marginBottom: "20px" }}>⚠️ {error}</div>}

        {analysis && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <button onClick={() => { setAnalysis(null); setBillText(""); setSaved(false); }} style={{ background: "rgba(100,116,139,0.15)", border: "1px solid rgba(100,116,139,0.25)", color: "#94A3B8", fontSize: "13px", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>← Nuevo análisis</button>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ background: `rgba(${analysis.urgencia==="Alta"?"239,68,68":analysis.urgencia==="Media"?"245,158,11":"34,197,94"},0.12)`, color: urgencyColor(analysis.urgencia), border: `1px solid ${urgencyColor(analysis.urgencia)}40`, padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Urgencia: {analysis.urgencia}</span>
                <span style={{ background: "rgba(203,166,82,0.1)", color: "#CBA652", border: "1px solid rgba(203,166,82,0.25)", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>Relevancia: {analysis.score_relevancia}/100</span>
                {saved && (
                  <span style={{ fontSize: "12px", color: "#4ADE80", display: "flex", alignItems: "center", gap: "4px" }}>
                    ✓ Guardado en historial
                  </span>
                )}
                <button onClick={exportPDF} disabled={exporting} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: exporting ? "rgba(100,116,139,0.2)" : "linear-gradient(135deg, #CBA652, #A88B3A)", color: exporting ? "#475569" : "#0B1120", border: "none", borderRadius: "8px", padding: "8px 18px", fontSize: "12px", fontWeight: 700, cursor: exporting ? "not-allowed" : "pointer", boxShadow: exporting ? "none" : "0 2px 12px rgba(203,166,82,0.3)" }}>
                  {exporting ? "⏳ Generando..." : "📥 Exportar PDF"}
                </button>
              </div>
            </div>

            <AnalysisSection icon="📋" title="Proyecto" delay={0}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#F1F5F9", margin: "0 0 8px 0", fontFamily: "'Source Serif 4', Georgia, serif" }}>{analysis.titulo}</h2>
              <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#64748B", flexWrap: "wrap" }}>
                <span>📄 {analysis.tipo}</span><span>🏛️ {analysis.comision}</span>
              </div>
            </AnalysisSection>

            <AnalysisSection icon="📝" title="Resumen Ejecutivo" delay={100}><p style={{ margin: 0 }}>{analysis.resumen_ejecutivo}</p></AnalysisSection>

            <AnalysisSection icon="🎯" title="Puntos Clave" delay={200}>
              {analysis.puntos_clave?.map((p: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ color: "#CBA652", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", minWidth: "24px" }}>{String(i+1).padStart(2,"0")}</span>
                  <span>{p}</span>
                </div>
              ))}
            </AnalysisSection>

            <AnalysisSection icon="⚡" title="Análisis de Impacto" delay={300}>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", color: "#4ADE80", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>Positivos</span>
                <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap" }}>{analysis.impactos_positivos?.map((imp: string, i: number) => <ImpactBadge key={i} type="positive" text={imp} />)}</div>
              </div>
              <div style={{ marginTop: "16px" }}>
                <span style={{ fontSize: "11px", color: "#F87171", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>Riesgos</span>
                <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap" }}>{analysis.impactos_negativos?.map((imp: string, i: number) => <ImpactBadge key={i} type="negative" text={imp} />)}</div>
              </div>
            </AnalysisSection>

            <AnalysisSection icon="🏢" title="Sectores Afectados" delay={350}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>{analysis.sectores_afectados?.map((s: string, i: number) => <ImpactBadge key={i} type="neutral" text={s} />)}</div>
            </AnalysisSection>

            <AnalysisSection icon="💰" title="Impacto Fiscal" delay={400}><p style={{ margin: 0 }}>{analysis.impacto_fiscal}</p></AnalysisSection>
            <AnalysisSection icon="📚" title="Antecedentes Legislativos" delay={450}><p style={{ margin: 0 }}>{analysis.antecedentes}</p></AnalysisSection>

            <AnalysisSection icon="🗳️" title="Recomendación de Voto" delay={500}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
                <span style={{ background: analysis.recomendacion_voto==="Acompañar"?"rgba(34,197,94,0.15)":analysis.recomendacion_voto==="Rechazar"?"rgba(239,68,68,0.15)":"rgba(245,158,11,0.15)", color: analysis.recomendacion_voto==="Acompañar"?"#4ADE80":analysis.recomendacion_voto==="Rechazar"?"#F87171":"#FBBF24", padding: "10px 24px", borderRadius: "10px", fontSize: "18px", fontWeight: 700, fontFamily: "'Source Serif 4', Georgia, serif", border: `1px solid ${analysis.recomendacion_voto==="Acompañar"?"rgba(34,197,94,0.3)":analysis.recomendacion_voto==="Rechazar"?"rgba(239,68,68,0.3)":"rgba(245,158,11,0.3)"}` }}>{analysis.recomendacion_voto}</span>
              </div>
              <p style={{ margin: 0 }}>{analysis.justificacion_voto}</p>
              <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#4ADE80", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>Argumentos a favor</span>
                  {analysis.argumentos_a_favor?.map((a: string, i: number) => <p key={i} style={{ fontSize: "13px", color: "#94A3B8", marginTop: "8px" }}>✓ {a}</p>)}
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#F87171", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>Argumentos en contra</span>
                  {analysis.argumentos_en_contra?.map((a: string, i: number) => <p key={i} style={{ fontSize: "13px", color: "#94A3B8", marginTop: "8px" }}>✗ {a}</p>)}
                </div>
              </div>
            </AnalysisSection>

            <AnalysisSection icon="✏️" title="Modificaciones Sugeridas" delay={550}>
              {analysis.modificaciones_sugeridas?.map((m: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ color: "#CBA652", fontWeight: 700, fontSize: "14px" }}>→</span><span>{m}</span>
                </div>
              ))}
            </AnalysisSection>

            <div style={{ textAlign: "center", marginTop: "40px", padding: "24px", borderTop: "1px solid rgba(100,116,139,0.15)", color: "#475569", fontSize: "12px" }}>
              <p style={{ margin: 0 }}>Informe generado por IA — Huella Propia · Análisis Legislativo Inteligente</p>
              <p style={{ margin: "4px 0 0 0", fontSize: "11px" }}>Este análisis es orientativo. Siempre validar con el equipo legal del bloque.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
