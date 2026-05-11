interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <div className={`backdrop-blur-md bg-slate-900/75 border border-slate-700/50 shadow-2xl ${className}`}>
      {children}
    </div>
  );
}
