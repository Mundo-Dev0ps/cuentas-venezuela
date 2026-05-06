import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function SourcePill({
  name,
  url,
  extractedAt,
}: {
  name: string;
  url: string;
  extractedAt?: string;
}) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full border border-slate-700/40 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
    >
      <span>Fuente: {name}</span>
      {extractedAt ? (
        <span className="text-slate-400">· {extractedAt}</span>
      ) : null}
      <ExternalLink className="h-3 w-3" />
    </Link>
  );
}
