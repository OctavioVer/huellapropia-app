import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Huella Propia — Análisis Legislativo Inteligente",
  description: "Plataforma de inteligencia legislativa con IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
