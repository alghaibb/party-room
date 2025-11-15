"use client";

import * as React from "react";
import {
  IconDashboard,
  IconUsers,
  IconDeviceGamepad,
  IconTrophy,
  IconUserPlus,
  IconSettings,
  IconHelp,
  IconSearch,
  IconHome,
  IconStar,
} from "@tabler/icons-react";

import { NavDocuments } from "./NavDocuments";
import { NavMain } from "./NavMain";
import { NavSecondary } from "./NavSecondary";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/lib/auth";
import Link from "next/link";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Party Rooms",
      url: "/dashboard/rooms",
      icon: IconHome,
    },
    {
      title: "Games",
      url: "/dashboard/games",
      icon: IconDeviceGamepad,
    },
    {
      title: "Friends",
      url: "/dashboard/friends",
      icon: IconUsers,
    },
    {
      title: "Leaderboard",
      url: "/dashboard/leaderboard",
      icon: IconTrophy,
    },
  ],
  navSecondary: [
    {
      title: "Home",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/dashboard/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/dashboard/search",
      icon: IconSearch,
    },
  ],
  quickActions: [
    {
      name: "Create Room",
      url: "/dashboard/rooms/create",
      icon: IconHome,
    },
    {
      name: "Join Room",
      url: "", // Not used - handled by dialog
      icon: IconUserPlus,
    },
    {
      name: "Achievements",
      url: "/dashboard/achievements",
      icon: IconStar,
    },
  ],
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLogoClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r border-foreground/5 bg-background/30 backdrop-blur-xl">
      <SidebarHeader className="border-b border-foreground/5 p-4">
        <div className="px-2">
          <Link
            href="/dashboard"
            onClick={handleLogoClick}
            className="flex items-center gap-3 p-2 rounded-xl transition-all hover:scale-105 group hover:bg-background/50"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--accent))] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-primary-foreground font-bold text-base">
                  🎉
                </span>
              </div>
              <div className="absolute -inset-1 bg-[linear-gradient(135deg,var(--primary),var(--accent))] rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
            </div>
            <span className="text-xl font-black bg-[linear-gradient(135deg,var(--foreground),var(--foreground)/70)] bg-clip-text text-transparent">
              Party Room
            </span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-6 py-6">
        <NavMain items={data.navMain} />
        <NavDocuments
          items={data.quickActions}
          isVerified={user.emailVerified}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-foreground/5 p-4">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
