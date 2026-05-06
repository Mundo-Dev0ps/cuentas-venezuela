"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/mapa-del-olvido", label: "Mapa del Olvido" },
  { href: "/datos-chile", label: "Datos Chile" },
];

export function SiteHeader() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 h-12 border-b border-slate-700/40 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          aria-label="cuentas-venezuela"
          className="inline-flex items-center gap-2 font-semibold whitespace-nowrap"
        >
          <BarChart3 className="h-5 w-5 text-orange-400" />
          <span className="hidden xs:inline sm:inline">cuentas-venezuela</span>
        </Link>

        <nav
          aria-label="primary"
          className="flex items-center gap-3 text-sm text-slate-300 sm:gap-5"
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
        </nav>
      </div>
    </header>
  );
}
