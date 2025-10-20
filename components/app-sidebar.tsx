"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "@/lib/auth-client"
import {
  TreePine,
  Bird,
  Flower,
  BookOpen,
  Map,
  Users,
  Settings,
  MessageCircle,
  GalleryVertical,
  Calendar,
  BarChart3,
  User,
  FileText,
  Database,
  UserCog,
  Shield,
  FolderOpen,
  Camera,
  Search,
  HelpCircle,
  Newspaper,
  Megaphone,
  ClipboardList,
  TrendingUp,
  Eye,
  Bell,
  Layers,
  Activity
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Role-based navigation items
const getNavigationItems = (role?: string) => {
  const baseItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Profil Taman",
      url: "/dashboard/taman",
      icon: TreePine,
    },
    {
      title: "Flora Taman",
      url: "/dashboard/taman/flora",
      icon: Flower,
    },
    {
      title: "Fauna Taman",
      url: "/dashboard/taman/fauna",
      icon: Bird,
    },
    {
      title: "Galeri",
      url: "/dashboard/galeri",
      icon: GalleryVertical,
    },
    {
      title: "Agenda",
      url: "/dashboard/agenda",
      icon: Calendar,
    },
  ];

  const superAdminItems = [
    {
      title: "Manajemen Pengguna",
      url: "/dashboard/users",
      icon: UserCog,
    },
    {
      title: "Antrian Persetujuan",
      url: "/dashboard/approvals",
      icon: ClipboardList,
    },
    {
      title: "Pengumuman",
      url: "/dashboard/announcements",
      icon: Megaphone,
    },
    {
      title: "Audit Log",
      url: "/dashboard/logs/audit",
      icon: Activity,
    },
    {
      title: "Data & Statistik",
      url: "/dashboard/data",
      icon: BarChart3,
    },
    {
      title: "Pengaturan Sistem",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const regionalAdminItems = [
    {
      title: "Pengumuman",
      url: "/dashboard/announcements",
      icon: Bell,
    },
    {
      title: "Profil Regional",
      url: "/dashboard/profile",
      icon: User,
    },
  ];

  const publicItems = [
    {
      title: "Artikel",
      url: "/artikel",
      icon: Newspaper,
    },
    {
      title: "Peta Interaktif",
      url: "/peta",
      icon: Map,
    },
    {
      title: "Indeks Keanekaragaman",
      url: "/indeks",
      icon: TrendingUp,
    },
  ];

  let items = [...baseItems];

  if (role === 'SUPER_ADMIN') {
    items = [...items, ...superAdminItems];
  } else if (role === 'REGIONAL_ADMIN') {
    items = [...items, ...regionalAdminItems];
  }

  return items;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const userData = session?.user ? {
    name: session.user.name || "Admin",
    email: session.user.email || "",
    avatar: session.user.image || "",
    role: session.user.role || "USER",
  } : {
    name: "Guest",
    email: "guest@example.com",
    avatar: "",
    role: "GUEST",
  };

  const navigationItems = getNavigationItems(userData.role);

  const navSecondary = [
    {
      title: "Artikel",
      url: "/artikel",
      icon: Newspaper,
    },
    {
      title: "Peta Interaktif",
      url: "/peta",
      icon: Map,
    },
    {
      title: "Indeks Keanekaragaman",
      url: "/indeks",
      icon: TrendingUp,
    },
    {
      title: "Pengaturan",
      url: "/dashboard/akun",
      icon: Settings,
    },
    {
      title: "Bantuan",
      url: "#",
      icon: HelpCircle,
    },
  ];

  // Filter secondary nav based on role
  const filteredNavSecondary = session?.user ? navSecondary : navSecondary.filter(item =>
    ['/artikel', '/peta', '/indeks'].includes(item.url)
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={session?.user ? "/dashboard" : "/"}>
                <div className="bg-green-600 rounded-lg p-1 mr-2">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
                <span className="text-base font-semibold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  Taman Kehati
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {session?.user ? (
          <>
            <NavMain items={navigationItems} />
            <NavSecondary items={filteredNavSecondary} className="mt-auto" />
          </>
        ) : (
          <div className="px-3 py-2">
            <p className="text-sm text-gray-500 mb-4">
              Silakan login untuk mengakses fitur lengkap.
            </p>
            <NavSecondary items={filteredNavSecondary} />
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
