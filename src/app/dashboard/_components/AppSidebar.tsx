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
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="px-2 py-1.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 p-1.5 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                🎉
              </span>
            </div>
            <span className="text-base font-semibold">Party Room</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments
          items={data.quickActions}
          isVerified={user.emailVerified}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
