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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
      url: "/rooms",
      icon: IconHome,
    },
    {
      title: "Games",
      url: "/games",
      icon: IconDeviceGamepad,
    },
    {
      title: "Friends",
      url: "/friends",
      icon: IconUsers,
    },
    {
      title: "Leaderboard",
      url: "/leaderboard",
      icon: IconTrophy,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
  quickActions: [
    {
      name: "Create Room",
      url: "/rooms/create",
      icon: IconHome,
    },
    {
      name: "Join Room",
      url: "/rooms/join",
      icon: IconUserPlus,
    },
    {
      name: "Achievements",
      url: "/achievements",
      icon: IconStar,
    },
  ],
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    🎉
                  </span>
                </div>
                <span className="text-base font-semibold">Party Room</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.quickActions} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
