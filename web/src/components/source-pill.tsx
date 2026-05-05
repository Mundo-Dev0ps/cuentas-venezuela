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
      className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
    >
      <span>Fuente: {name}</span>
      {extractedAt ? (
        <span className="text-neutral-500">· {extractedAt}</span>
      ) : null}
      <ExternalLink className="h-3 w-3" />
    </Link>
  );
}
