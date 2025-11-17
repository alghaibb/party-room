"use client";

import { type Icon } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
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
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
        Quick Actions
      </SidebarGroupLabel>
      <SidebarGroupContent className="px-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;

            // Special handling for Join Room - show dialog instead of link
            if (item.name === "Join Room") {
              return (
                <SidebarMenuItem key={item.name}>
                  <JoinRoomTrigger
                    isVerified={isVerified}
                    className="w-full justify-start rounded-xl hover:scale-[1.02] transition-all"
                  />
                </SidebarMenuItem>
              );
            }

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary! shadow-md font-semibold data-[active=true]:bg-primary!"
                      : "hover:bg-background/50 hover:scale-[1.02]"
                  }`}
                >
                  <Link
                    href={item.url}
                    onClick={handleLinkClick}
                    className="gap-3"
                  >
                    <item.icon
                      className={`w-4 h-4 ${
                        isActive ? "text-background" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`${
                        isActive
                          ? "text-background font-bold tracking-tight"
                          : "text-muted-foreground font-medium tracking-wide"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
