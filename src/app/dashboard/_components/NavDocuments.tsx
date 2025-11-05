"use client";

import { type Icon } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { JoinRoomTrigger } from "./JoinRoomTrigger";
import Link from "next/link";

export function NavDocuments({
  items,
  isVerified = true,
}: {
  items: {
    name: string;
    url: string;
    icon: Icon;
  }[];
  isVerified?: boolean;
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Special handling for Join Room - show dialog instead of link
          if (item.name === "Join Room") {
            return (
              <SidebarMenuItem key={item.name}>
                <JoinRoomTrigger
                  isVerified={isVerified}
                  className="w-full justify-start"
                />
              </SidebarMenuItem>
            );
          }

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
