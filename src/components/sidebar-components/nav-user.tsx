"use client";

import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { IconDotsVertical } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick={() => router.push("/dashboard/settings")}
        >
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage
              src={user?.imageUrl || ""}
              alt={user?.fullName || ""}
            />
            <AvatarFallback className="rounded-lg">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.fullName}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
          <IconDotsVertical className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
