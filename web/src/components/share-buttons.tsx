"use client";

import { useState } from "react";
import { Link2, MessageCircle, Twitter } from "lucide-react";

interface ShareButtonsProps {
  url?: string;
  text?: string;
}

export function ShareButtons({
  url = "https://cuentasvenezuela.org",
  text = "Cuentas Venezuela: datos oficiales sobre Venezuela y la diáspora venezolana, sin tracking ni publicidad.",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore — clipboard API blocked
    }
  }

  const cls =
    "inline-flex items-center gap-2 rounded-md border border-slate-700/40 bg-slate-900/60 hover:border-cyan-400/50 hover:text-cyan-300 px-3 py-2 text-sm text-slate-200 transition-colors";

  return (
    <div id="share" className="flex flex-wrap gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        <Twitter className="h-4 w-4" aria-hidden /> X / Twitter
      </a>
      <a
        href={`https://wa.me/?text=${enc(`${text} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
      </a>
      <button type="button" onClick={copy} className={cls}>
        <Link2 className="h-4 w-4" aria-hidden />
        {copied ? "Copiado ✓" : "Copiar enlace"}
      </button>
    </div>
  );
}
