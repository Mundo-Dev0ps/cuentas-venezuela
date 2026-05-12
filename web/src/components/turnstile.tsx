"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Cloudflare Turnstile widget (free invisible / managed CAPTCHA).
 * Loads the loader script once per page, renders the widget into a
 * stable container id, and propagates the verification token up via
 * onToken (also exposes onExpire so the parent can clear state).
 *
 * Site key comes from NEXT_PUBLIC_TURNSTILE_SITE_KEY. If the env var is
 * missing the widget renders nothing — the form should still submit,
 * the backend will reject with 401 if it requires the token.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "compact" | "flexible" | "invisible";
        },
      ) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const LOADER_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function ensureLoader(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = LOADER_SRC;
    s.async = true;
    s.defer = true;
    s.addEventListener("load", () => resolve(), { once: true });
    document.head.appendChild(s);
  });
}

interface TurnstileProps {
  onToken: (token: string) => void;
  onExpire?: () => void;
  theme?: "auto" | "light" | "dark";
  size?: "normal" | "compact" | "flexible";
  className?: string;
}

export function Turnstile({
  onToken,
  onExpire,
  theme = "dark",
  size = "flexible",
  className,
}: TurnstileProps) {
  const containerId = useId().replace(/:/g, "");
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    ensureLoader().then(() => {
      if (cancelled || !window.turnstile) return;
      const el = document.getElementById(containerId);
      if (!el) return;
      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: siteKey,
        theme,
        size,
        callback: (token) => onToken(token),
        "expired-callback": () => onExpire?.(),
        "error-callback": () => onExpire?.(),
      });
    });
    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [containerId, siteKey, theme, size, onToken, onExpire]);

  if (!siteKey) {
    // env not set — render placeholder note in dev, nothing in prod.
    return (
      <div className={className}>
        <p className="text-xs text-amber-400/70 italic">
          (Turnstile no configurado: falta NEXT_PUBLIC_TURNSTILE_SITE_KEY)
        </p>
      </div>
    );
  }

  return <div id={containerId} className={className} />;
}
