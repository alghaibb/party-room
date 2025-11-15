"use client";

import { useState, useEffect } from "react";
import {
  IconCreditCard,
  IconDotsVertical,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

interface NavUserProps {
  user: User;
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure DropdownMenu only renders after hydration to avoid ID mismatches
  useEffect(() => {
    // Use setTimeout to defer setState and avoid React Compiler warning
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Render button only during SSR, full DropdownMenu after client mount
  if (!isMounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="rounded-xl bg-background/40 backdrop-blur-sm border border-foreground/10 hover:bg-background/60 hover:text-foreground transition-all"
          >
            <Avatar className="h-9 w-9 rounded-xl border-2 border-foreground/10">
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback className="rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-primary-foreground font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="text-muted-foreground/80 truncate text-xs">
                {user.email}
              </span>
            </div>
            <IconDotsVertical className="ml-auto size-4 text-muted-foreground" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="rounded-xl bg-background/40 backdrop-blur-sm border border-foreground/10 hover:bg-background/60 hover:text-foreground data-[state=open]:bg-background/60 data-[state=open]:text-foreground transition-all"
          >
              <Avatar className="h-9 w-9 rounded-xl border-2 border-foreground/10">
                <AvatarImage src={user.image ?? ""} alt={user.name} />
                <AvatarFallback className="rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-primary-foreground font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="text-muted-foreground/80 truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl bg-background/95 backdrop-blur-xl border border-foreground/10 shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-xl border-2 border-foreground/10">
                  <AvatarImage src={user.image ?? ""} alt={user.name} />
                  <AvatarFallback className="rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-primary-foreground font-bold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="text-muted-foreground/80 truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-foreground/10" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="rounded-lg hover:bg-background/50 transition-colors">
                <IconUserCircle className="w-4 h-4 mr-2" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg hover:bg-background/50 transition-colors">
                <IconCreditCard className="w-4 h-4 mr-2" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg hover:bg-background/50 transition-colors">
                <IconNotification className="w-4 h-4 mr-2" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-foreground/10" />
            <DropdownMenuItem className="rounded-lg hover:bg-background/50 transition-colors">
              <SignOutButton className="w-full" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
