"use client";

import { useState } from "react";

type SubmitState = "idle" | "submitting" | "ok" | "error";

export default function ReportarPage() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      descripcion: String(fd.get("descripcion") || ""),
      contacto: String(fd.get("contacto") || "") || undefined,
      evidencia_url: String(fd.get("evidencia_url") || "") || undefined,
    };

    if (payload.descripcion.length < 10) {
      setError("La descripción debe tener al menos 10 caracteres.");
      setState("error");
      return;
    }

    // Plan 2 wires this to /api/reportes. For now, simulate success.
    console.log("[reportar] payload:", payload);
    await new Promise((r) => setTimeout(r, 400));
    setState("ok");
  }

  if (state === "ok") {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">Reporte recibido</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          Gracias por contribuir. Revisaremos la información antes de
          publicarla.
        </p>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-bold">Reportar una obra</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Datos nuevos, correcciones o evidencia visual. Toda la información se
        verifica antes de publicar.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">
            Descripción (mín. 10 caracteres)
          </span>
          <textarea
            name="descripcion"
            required
            minLength={10}
            rows={5}
            className="mt-1 block w-full rounded border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900"
            placeholder="Nombre de la obra, ubicación, qué observaste, año aprox..."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">
            Correo de contacto (opcional)
          </span>
          <input
            type="email"
            name="contacto"
            className="mt-1 block w-full rounded border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900"
            placeholder="tu@email.com"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">
            URL de evidencia (foto, noticia, opcional)
          </span>
          <input
            type="url"
            name="evidencia_url"
            className="mt-1 block w-full rounded border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900"
            placeholder="https://..."
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {state === "submitting" ? "Enviando…" : "Enviar reporte"}
        </button>
      </form>
    </article>
  );
}
