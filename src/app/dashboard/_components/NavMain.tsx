"use client";

import { type Icon } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1.5 px-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
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
                    {item.icon && (
                      <item.icon
                        className={`w-5 h-5 ${
                          isActive ? "text-background" : "text-muted-foreground"
                        }`}
                      />
                    )}
                    <span
                      className={`${
                        isActive
                          ? "text-background font-bold tracking-tight"
                          : "text-muted-foreground font-medium tracking-wide"
                      }`}
                    >
                      {item.title}
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
