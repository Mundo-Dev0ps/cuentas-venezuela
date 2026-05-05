import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/card";

const CATEGORIES = [
  {
    href: "/datos-chile/dashboards/demografia",
    title: "Demografía",
    desc: "Stock migratorio por región y año, mapa nacional, comparativa legal vs estimado total.",
  },
  {
    href: "/datos-chile/dashboards/pensiones",
    title: "Pensiones",
    desc: "Cotizantes AFP por sector económico y serie temporal.",
  },
  {
    href: "/datos-chile/dashboards/tributario",
    title: "Tributario",
    desc: "Aporte estimado por impuesto a la renta e IVA.",
  },
  {
    href: "/datos-chile/dashboards/comparativa",
    title: "Comparativa por nacionalidad",
    desc: "Stock legal de las principales colectividades migrantes en Chile (Venezuela, Perú, Haití, Colombia, Bolivia).",
  },
];

export default function DashboardsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Dashboards</h1>
      <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
        Vistas pre-armadas por categoría. Cada gráfico cita su fuente y se
        consume directamente desde Parquet en almacenamiento.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <Link key={cat.href} href={cat.href}>
            <Card className="h-full transition hover:border-emerald-500">
              <CardTitle>{cat.title}</CardTitle>
              <CardDescription>{cat.desc}</CardDescription>
              <div className="mt-4 inline-flex items-center gap-1 text-sm text-emerald-600">
                Abrir <ArrowRight className="h-4 w-4" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
