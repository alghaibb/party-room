import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";

export function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="flex h-screen">
          <div className="flex flex-1 flex-col overflow-hidden">
            <header className="bg-background flex h-14 items-center gap-4 border-b px-6">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1" />
            </header>
            <div className="flex-1 overflow-auto p-6">{children}</div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
