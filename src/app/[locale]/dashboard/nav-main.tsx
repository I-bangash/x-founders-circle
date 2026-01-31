"use client";

import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import { type Icon, IconCirclePlusFilled, IconMail } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
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
  icon?: Icon;
}

function QuickCreateSection() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="mb-4 flex items-center gap-2">
        <SidebarMenuButton
          tooltip="Quick Create"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
        >
          <IconCirclePlusFilled />
          <span>Quick Create</span>
        </SidebarMenuButton>
        <Button
          size="icon"
          className="size-8 group-data-[collapsible=icon]:opacity-0"
          variant="outline"
        >
          <IconMail />
          <span className="sr-only">Inbox</span>
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function NavItemsList({
  items,
  optimisticPath,
  onNavigate,
}: {
  items: NavItem[];
  optimisticPath: string;
  onNavigate: (url: string) => void;
}) {
  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive =
          optimisticPath === item.url ||
          (optimisticPath === "/dashboard" && item.url === "/dashboard");

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              onClick={() => onNavigate(item.url)}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [optimisticPath, setOptimisticPath] = useOptimistic(pathname);
  const [isPending, startTransition] = useTransition();

  const handleNavigation = (url: string) => {
    startTransition(() => {
      setOptimisticPath(url);
      router.push(url);
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent
        className="flex flex-col gap-2"
        data-pending={isPending ? "" : undefined}
      >
        <QuickCreateSection />
        <NavItemsList
          items={items}
          optimisticPath={optimisticPath}
          onNavigate={handleNavigation}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
