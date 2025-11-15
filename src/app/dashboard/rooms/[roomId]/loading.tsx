export default function RoomLoading() {
  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-6 h-full min-h-0">
      <div className="lg:w-80 flex flex-col gap-4">
        <div className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 p-6">
          <div className="h-7 w-40 bg-muted/50 animate-pulse rounded mb-3" />
          <div className="h-4 w-32 bg-muted/50 animate-pulse rounded" />
        </div>
        <div className="rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 p-6">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted/50 animate-pulse rounded-full" />
                <div className="h-4 w-36 bg-muted/50 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="flex-1 rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 p-6">
          <div className="h-64 w-full bg-muted/50 animate-pulse rounded-2xl" />
        </div>
      </div>

      <div className="lg:w-80 flex flex-col gap-4">
        <div className="flex-1 rounded-2xl bg-background/40 backdrop-blur-xl border border-foreground/10 p-6">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

