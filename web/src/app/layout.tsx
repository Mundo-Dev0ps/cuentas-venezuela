import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "datos-chile — Migración venezolana en Chile",
  description:
    "Datos oficiales agregados, comparables y citados sobre la migración venezolana en Chile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col text-slate-100 antialiased animate-page-fade">
        <SiteHeader />
        <div className="flex-1 animate-page-rise">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
