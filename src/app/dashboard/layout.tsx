import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { AppSidebar } from "./_components/AppSidebar";
import { SiteHeader } from "./_components/SiteHeader";
import { VerificationBanner } from "./_components/VerificationBanner";
import { ModalProvider } from "@/providers/ModalProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getSession();
  const user = session?.user;

  // Authentication and onboarding checks
  if (!user) {
    redirect("/sign-in");
  }

  // Allow unverified users but still require onboarding
  if (user.emailVerified && !user.hasOnboarded) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        {!user.emailVerified && <VerificationBanner userEmail={user.email} />}
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
      <ModalProvider />
    </SidebarProvider>
  );
}
