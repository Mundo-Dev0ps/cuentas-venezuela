"use client";

import { useState } from "react";
import { Coffee } from "lucide-react";

interface KofiFeedProps {
  url?: string;
  height?: number;
}

export function KofiFeed({
  url = process.env.NEXT_PUBLIC_KOFI_URL ?? "https://ko-fi.com/donjonny",
  height = 600,
}: KofiFeedProps) {
  const [show, setShow] = useState(false);

  if (show) {
    return (
      <div className="rounded-xl border border-slate-700/40 overflow-hidden bg-white">
        <iframe
          src={`${url}/?embedfeed`}
          title="Ko-fi"
          style={{ border: "none", width: "100%", minHeight: height }}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-pink-400/40 bg-pink-500/5 px-6 py-10 text-center">
      <Coffee className="h-8 w-8 text-pink-400 mx-auto mb-3" aria-hidden />
      <p className="text-slate-200 text-sm mb-1 font-semibold">
        Mostrar feed de Ko-fi
      </p>
      <p className="text-slate-400 text-xs mb-5">
        Carga el formulario de aporte directo (servido por ko-fi.com).
        Si prefieres no cargar terceros, abre el link directo abajo.
      </p>
      <button
        type="button"
        onClick={() => setShow(true)}
        className="inline-flex items-center gap-2 rounded-md bg-pink-500 hover:bg-pink-400 text-slate-900 text-sm font-semibold px-4 py-2 transition-colors"
      >
        <Coffee className="h-4 w-4" aria-hidden />
        Cargar feed Ko-fi
      </button>
      <p className="mt-4 text-xs text-slate-500">
        o ir directo a{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-300 hover:text-pink-200 underline underline-offset-2"
        >
          {url.replace(/^https?:\/\//, "")}
        </a>
      </p>
    </div>
  );
}
