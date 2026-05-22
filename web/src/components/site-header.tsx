"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { KofiButton } from "@/components/kofi-button";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/mapa-del-olvido", label: "Mapa del Olvido" },
  { href: "/datos-chile", label: "Datos Chile" },
  { href: "/venezuela", label: "Venezuela" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-slate-700/40 bg-slate-900/80 backdrop-blur-md text-sm">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          aria-label="Cuentas Venezuela"
          className="inline-flex items-center gap-2 whitespace-nowrap"
        >
          <BarChart3 className="h-5 w-5 text-orange-400" />
          <span className="text-sm font-semibold text-slate-100">
            Cuentas Venezuela
          </span>
        </Link>

        <nav
          aria-label="primary"
          className="hidden md:flex items-center gap-3 text-sm text-slate-300 sm:gap-5"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap transition hover:text-cyan-300",
                isActive(item.href) && "font-semibold text-cyan-300",
              )}
            >
              {item.label}
            </Link>
          ))}
          <KofiButton variant="header" source="site-header" />
        </nav>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex md:hidden h-11 w-11 items-center justify-center rounded-md text-slate-200 hover:text-cyan-300"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav
          aria-label="mobile"
          className="md:hidden border-t border-slate-700/40 bg-slate-900/95 px-4 py-2"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block py-3 text-base text-slate-200 hover:text-cyan-300",
                isActive(item.href) && "font-semibold text-cyan-300",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/apoyar"
            className="block py-3 text-base text-pink-300 hover:text-pink-200"
          >
            ☕ Apoyar
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
