import {
  Home,
  User,
  Settings,
  Users,
  Gamepad2,
  MessageCircle,
  BarChart3,
  Shield,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    description: "Go back to the main page",
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
    description: "Manage your profile settings",
  },
  {
    title: "Friends",
    url: "/dashboard/friends",
    icon: Users,
    description: "Manage your friends",
  },
  {
    title: "Rooms",
    url: "/dashboard/rooms",
    icon: MessageCircle,
    description: "Join or create chat rooms",
  },
  {
    title: "Games",
    url: "/dashboard/games",
    icon: Gamepad2,
    description: "Browse and play games",
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
    description: "View your statistics",
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    description: "Application settings",
  },
  {
    title: "Admin",
    url: "/dashboard/admin",
    icon: Shield,
    description: "Admin panel",
  },
];

export const sidebarGroups = [
  {
    title: "Main",
    items: sidebarItems.slice(0, 2), // Home and Profile
  },
  {
    title: "Social",
    items: sidebarItems.slice(2, 4), // Friends and Rooms
  },
  {
    title: "Gaming",
    items: sidebarItems.slice(4, 6), // Games and Analytics
  },
  {
    title: "Management",
    items: sidebarItems.slice(6), // Settings and Admin
  },
];
