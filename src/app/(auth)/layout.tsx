export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh flex">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary/20 via-secondary/10 to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-background/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4 tracking-tight">
            Party Room
          </h1>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
            Connect, celebrate, and create unforgettable moments together
          </p>
        </div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-ping" />
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-secondary/40 rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-accent/50 rounded-full animate-bounce" />
      </div>

      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
