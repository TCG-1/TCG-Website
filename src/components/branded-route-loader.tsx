type BrandedRouteLoaderProps = {
  scope: "admin" | "client-hub";
};

const copyByScope = {
  admin: {
    label: "Loading admin workspace",
    detail: "Syncing training operations data...",
    background: "bg-[#f5f2ee]",
    panel: "bg-white/80 border-black/5",
    heading: "text-[#8a0917]",
    detailClass: "text-slate-500",
    ring: "border-[#8a0917]/20 border-t-[#8a0917]",
    dot: "bg-[#8a0917]/20",
  },
  "client-hub": {
    label: "Loading training hub",
    detail: "Preparing your learning journey...",
    background: "bg-[#f7f6f3]",
    panel: "bg-white/75 border-[#e8ddd9]",
    heading: "text-[#7d0b16]",
    detailClass: "text-slate-500",
    ring: "border-[#8a0917]/20 border-t-[#8a0917]",
    dot: "bg-[#d8a400]/35",
  },
} as const;

export function BrandedRouteLoader({ scope }: BrandedRouteLoaderProps) {
  const style = copyByScope[scope];

  return (
    <div className={`min-h-[40vh] ${style.background} px-4 py-10 sm:px-6 lg:px-10`}>
      <div className={`mx-auto max-w-7xl rounded-[1.6rem] border ${style.panel} p-8 sm:p-10`}>
        <div className="flex flex-col items-center justify-center gap-5 text-center">
          <div className={`h-11 w-11 animate-spin rounded-full border-[3px] ${style.ring}`} />
          <div>
            <p className={`text-sm font-bold uppercase tracking-[0.2em] ${style.heading}`}>{style.label}</p>
            <p className={`mt-2 text-sm ${style.detailClass}`}>{style.detail}</p>
          </div>
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className={`h-2.5 w-2.5 animate-pulse rounded-full ${style.dot}`} />
            <span className={`h-2.5 w-2.5 animate-pulse rounded-full ${style.dot}`} style={{ animationDelay: "160ms" }} />
            <span className={`h-2.5 w-2.5 animate-pulse rounded-full ${style.dot}`} style={{ animationDelay: "320ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
