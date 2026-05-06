"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/mapa-del-olvido", label: "Mapa del Olvido" },
  { href: "/datos-chile", label: "Datos Chile" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/40 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-semibold"
        >
          <BarChart3 className="h-5 w-5 text-orange-400" />
          <span>cuentas-venezuela</span>
        </Link>

        <nav className="hidden gap-5 text-sm text-slate-300 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition hover:text-slate-100",
                isActive(item.href) &&
                  "font-semibold text-orange-400",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-200 hover:bg-slate-800 md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-slate-700/40 bg-slate-900/80 px-4 py-2 md:hidden">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-sm text-slate-200 hover:bg-slate-800/80",
                    isActive(item.href) &&
                      "bg-orange-900/30 font-semibold text-orange-400",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
