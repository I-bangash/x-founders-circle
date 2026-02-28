"use client";

import Image from "next/image";
import Link from "next/link";

import {
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
  IconSparkles,
} from "@tabler/icons-react";

// import { ChatMaxingIconColoured } from "@/components/logo";
import { NavDocuments } from "@/components/sidebar-components/nav-documents";
import { NavMain } from "@/components/sidebar-components/nav-main";
import { NavSecondary } from "@/components/sidebar-components/nav-secondary";
import { NavUser } from "@/components/sidebar-components/nav-user";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const SIDEBAR_DATA = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Founders on X Logo"
                  width={24}
                  height={24}
                  className="!size-6 rounded-md"
                />
                <span className="text-base font-semibold">Founders on X</span>
                {/* <Badge
                  variant="outline"
                  className="text-muted-foreground text-xs"
                >
                  beta
                </Badge> */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SIDEBAR_DATA.navMain} />
        {/* <NavDocuments items={SIDEBAR_DATA.documents} /> */}
        <NavSecondary items={SIDEBAR_DATA.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
