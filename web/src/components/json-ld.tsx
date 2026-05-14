/**
 * Inline JSON-LD script tag. Server-rendered (no client JS). Use inside
 * any server component to ship schema.org structured data to Google /
 * Bing / DuckDuckGo / Yandex.
 *
 * Example:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "Dataset", ... }} />
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cuentasvenezuela.org";

interface BreadcrumbItem {
  name: string;
  /** Absolute path starting with "/". */
  path: string;
}

/** Builds a schema.org BreadcrumbList object for a Page hierarchy. */
export function breadcrumbsJsonLd(items: BreadcrumbItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

interface DatasetInput {
  name: string;
  description: string;
  /** Path of the dashboard page that visualises this dataset. */
  path: string;
  /** Comma-separated list of keyword tags. */
  keywords?: string[];
  /** Schema.org creator (e.g. publisher organization). */
  publisherName?: string;
  /** ISO-8601 date or year. */
  temporalCoverage?: string;
  /** Spatial coverage description (e.g. "Venezuela", "Latinoamérica"). */
  spatialCoverage?: string;
  /** License URL (e.g. CC BY). */
  license?: string;
  /** Original source URL (where the raw data was downloaded from). */
  sameAs?: string;
}

/**
 * schema.org Dataset — eligible for indexing by Google Dataset Search.
 * Required fields: name, description. Everything else is enrichment.
 */
export function datasetJsonLd({
  name,
  description,
  path,
  keywords,
  publisherName = "Cuentas Venezuela",
  temporalCoverage,
  spatialCoverage,
  license = "https://creativecommons.org/licenses/by/4.0/",
  sameAs,
}: DatasetInput): object {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url: `${SITE_URL}${path}`,
    inLanguage: "es",
    isAccessibleForFree: true,
    license,
    keywords: keywords?.join(", "),
    publisher: {
      "@type": "Organization",
      name: publisherName,
      url: SITE_URL,
    },
    creator: {
      "@type": "Organization",
      name: publisherName,
      url: SITE_URL,
    },
    ...(temporalCoverage ? { temporalCoverage } : {}),
    ...(spatialCoverage
      ? {
          spatialCoverage: {
            "@type": "Place",
            name: spatialCoverage,
          },
        }
      : {}),
    ...(sameAs ? { sameAs } : {}),
  };
}
