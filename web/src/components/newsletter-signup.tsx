"use client";

import { useState } from "react";
import { Mail, Check, AlertCircle } from "lucide-react";

type Status = "idle" | "loading" | "ok" | "error";

interface NewsletterSignupProps {
  /** Tag for analytics + future segmentation (e.g. "venezuela", "general") */
  interest?: string;
  placeholder?: string;
  helper?: string;
}

export function NewsletterSignup({
  interest = "general",
  placeholder = "tu@email.com",
  helper = "Avisos cuando publiquemos nuevos datasets o dashboards. Sin spam, sin tracking. Te puedes desuscribir cuando quieras.",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interest, website }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setStatus("ok");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrMsg((err as Error).message || "Error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 flex items-center gap-2 text-sm text-emerald-300">
        <Check className="h-4 w-4" aria-hidden />
        Listo. Te avisaremos cuando haya novedades.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
            aria-hidden
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-800/70 border border-slate-700/40 rounded-md pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
            disabled={status === "loading"}
          />
          {/* honeypot: hidden from real users, bots fill it */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === "loading" ? "Enviando..." : "Avisarme"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-rose-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" aria-hidden /> {errMsg}
        </p>
      )}
      <p className="text-xs text-slate-500">{helper}</p>
    </form>
  );
}
