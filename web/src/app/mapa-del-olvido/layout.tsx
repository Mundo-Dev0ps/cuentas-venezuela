export const metadata = {
  title: "Mapa del Olvido — Cuentas Venezuela",
  description:
    "Mapa interactivo de obras públicas en Venezuela: inauguradas, abandonadas y paralizadas.",
};

export default function MapaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-[calc(100dvh-8rem)]">{children}</div>;
}
