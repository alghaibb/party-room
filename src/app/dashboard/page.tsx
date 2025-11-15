import { SectionCards } from "./_components/SectionCards";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function DashboardPage() {
  return (
    <div className="@container/main flex flex-1 flex-col">
      <div className="flex flex-col gap-8 py-6 md:py-8 px-4 md:px-6">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            <span className="block">Welcome</span>
            <span className="block bg-[linear-gradient(135deg,var(--primary),var(--accent))] bg-clip-text text-transparent">
              Back
            </span>
          </h1>
          <p className="text-lg text-muted-foreground/80">
            Here&apos;s what&apos;s happening with your party rooms
          </p>
        </div>
        <SectionCards />
      </div>
    </div>
  );
}
