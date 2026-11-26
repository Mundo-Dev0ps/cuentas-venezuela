export function MapSkeleton() {
  return (
    <div className="absolute inset-0 z-50 bg-[#06102a] flex flex-col">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-slate-900/75 border border-white/[0.08] rounded-xl px-5 py-3 flex gap-6">
          <SkBlock w="w-12" h="h-6" />
          <div className="w-px h-10 bg-slate-700" />
          <SkBlock w="w-20" h="h-6" />
          <div className="w-px h-10 bg-slate-700" />
          <SkBlock w="w-12" h="h-6" />
        </div>
      </div>

      <div className="absolute top-4 left-4 w-72 hidden sm:block">
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-xl p-3 space-y-3">
          <SkBlock h="h-8" w="w-full" />
          <SkBlock h="h-3" w="w-1/3" />
          <div className="flex gap-1.5">
            <SkBlock h="h-5" w="w-20" rounded="rounded-full" />
            <SkBlock h="h-5" w="w-16" rounded="rounded-full" />
            <SkBlock h="h-5" w="w-24" rounded="rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border border-cyan-400/30 bg-slate-900/60 flex items-center justify-center">
          <p className="text-slate-300 text-xs font-mono motion-safe:animate-pulse">
            Cargando mapa
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-3 sm:px-8">
        <div className="bg-slate-900/70 border border-white/[0.08] rounded-2xl p-4">
          <SkBlock h="h-3" w="w-full" />
        </div>
      </div>
    </div>
  );
}

function SkBlock({
  w = 'w-full',
  h = 'h-4',
  rounded = 'rounded',
}: { w?: string; h?: string; rounded?: string }) {
  return <div className={`${w} ${h} ${rounded} bg-slate-700/50`} />;
}
