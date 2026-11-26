"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Coffee, Menu, X } from "lucide-react";
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
    <header className="sticky top-0 z-40 shrink-0 border-b border-white/[0.08] bg-slate-900/85 backdrop-blur-md text-sm">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          aria-label="Cuentas Venezuela"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-md px-1 py-1"
        >
          <BarChart3 className="h-[18px] w-[18px] text-orange-400" strokeWidth={1.5} aria-hidden />
          <span className="text-sm font-medium text-slate-100">
            Cuentas Venezuela
          </span>
        </Link>

        <nav
          aria-label="primary"
          className="hidden md:flex items-center gap-3 text-sm text-slate-300 sm:gap-5"
        >
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-md px-1.5 py-1 transition-colors duration-150 ease-out hover:text-cyan-300",
                  active && "font-medium text-cyan-300 underline decoration-cyan-400/60 decoration-2 underline-offset-8",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <KofiButton variant="header" source="site-header" />
        </nav>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex md:hidden h-11 w-11 items-center justify-center rounded-md text-slate-200 transition-colors duration-150 hover:text-cyan-300 active:scale-[0.96]"
        >
          {open ? (
            <X className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
          ) : (
            <Menu className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
          )}
        </button>
      </div>

      {open ? (
        <nav
          aria-label="mobile"
          className="md:hidden border-t border-white/[0.08] bg-slate-900/95 px-4 py-2"
        >
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block py-3 text-base text-slate-200 transition-colors duration-150 hover:text-cyan-300",
                  active && "font-medium text-cyan-300",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/apoyar"
            className="flex items-center gap-2 py-3 text-base text-pink-300 transition-colors duration-150 hover:text-pink-200"
          >
            <Coffee className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
            <span>Apoyar</span>
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
