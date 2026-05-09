import { Coffee } from "lucide-react";

const KOFI_URL =
  process.env.NEXT_PUBLIC_KOFI_URL ?? "https://ko-fi.com/donjonny";

export type KofiVariant = "pill" | "card" | "footer" | "header";

interface KofiButtonProps {
  variant?: KofiVariant;
  source?: string; // tracking source (e.g. "footer", "dashboard-ve") — query param ?ref=
  className?: string;
  label?: string;
}

const STYLES: Record<KofiVariant, string> = {
  pill: "inline-flex items-center gap-1.5 rounded-full bg-pink-500 hover:bg-pink-400 text-slate-900 font-semibold text-sm px-4 py-1.5 transition-colors",
  card: "inline-flex items-center gap-2 rounded-lg bg-pink-500 hover:bg-pink-400 text-slate-900 font-bold text-base px-6 py-3 shadow-lg transition-colors",
  footer:
    "inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 text-sm transition-colors",
  header:
    "hidden md:inline-flex items-center gap-1 text-pink-300 hover:text-pink-200 text-sm font-medium transition-colors",
};

export function KofiButton({
  variant = "pill",
  source,
  className,
  label,
}: KofiButtonProps) {
  const href = source ? `${KOFI_URL}?ref=${encodeURIComponent(source)}` : KOFI_URL;
  const text = label ?? (variant === "footer" || variant === "header" ? "Apoyar" : "Apoyar en Ko-fi");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${STYLES[variant]} ${className ?? ""}`}
      title="Apoyá el proyecto en Ko-fi"
      data-kofi-source={source ?? variant}
    >
      <Coffee className={variant === "card" ? "h-5 w-5" : "h-4 w-4"} aria-hidden />
      <span>{text}</span>
    </a>
  );
}
