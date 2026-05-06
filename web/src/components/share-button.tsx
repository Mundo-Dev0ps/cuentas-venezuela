"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

export function ShareButton({ label = "Copiar enlace" }: { label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback: select prompt
      window.prompt("Copia este enlace:", window.location.href);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-900 dark:border-neutral-700 dark:hover:bg-neutral-800"
      aria-label={label}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-orange-400" /> Copiado
        </>
      ) : (
        <>
          <LinkIcon className="h-4 w-4" /> {label}
        </>
      )}
    </button>
  );
}
