import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";

interface SourceBadgeProps {
  /** Source slug as stored in `sources.slug` (lowercased, kebab-case). */
  slug: string;
  /** Human-readable source name shown in the badge. */
  name: string;
  /** External canonical URL for the source — opens in new tab. */
  url: string;
  className?: string;
}

/**
 * Compact, page-level citation badge. Two affordances:
 *  - "Cómo verificar" → in-app /fuentes page, anchor to this source.
 *  - "<source name> ↗" → direct external link to the official source.
 *
 * Lives near the page hero so the citation is visible before any chart.
 */
export function SourceBadge({ slug, name, url, className }: SourceBadgeProps) {
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/5 pl-2 pr-1 py-1 text-xs text-cyan-200 ${className ?? ""}`}
    >
      <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
      <span className="text-slate-300">Fuente:</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-0.5"
      >
        {name} <ExternalLink className="h-3 w-3" aria-hidden />
      </a>
      <Link
        href={`/fuentes#${slug}` as never}
        className="ml-1 rounded-full bg-cyan-400/15 hover:bg-cyan-400/25 text-cyan-100 px-2 py-0.5"
      >
        Cómo verificar →
      </Link>
    </div>
  );
}
