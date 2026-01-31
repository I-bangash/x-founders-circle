"use client";

import Link from "next/link";
import * as React from "react";

import { type Icon, IconBrightness } from "@tabler/icons-react";

import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: Icon;
}

interface NavSecondaryProps extends React.ComponentPropsWithoutRef<
  typeof SidebarGroup
> {
  items: NavItem[];
}

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex w-full items-center gap-2">
                <IconBrightness />
                <span>Dark Mode</span>
                <div className="ml-auto">
                  <ModeToggle />
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
