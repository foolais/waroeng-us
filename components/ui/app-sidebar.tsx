"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { adminSidenavItems, superSidenavItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Title from "./title";
import LogoutButton from "../button/logout-btn";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const AppSidebar = ({ type }: { type: "SUPER" | "ADMIN" }) => {
  const items = type === "SUPER" ? superSidenavItems : adminSidenavItems;
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();
  const { data: session } = useSession();
  const storeId = session?.user.storeId;

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader
        className={cn(isCollapsed ? "flex-center" : "px-3", "mt-2")}
      >
        <Title />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu
          className={cn(
            isCollapsed ? "item-center flex justify-center" : "items-start",
            "mt-1 flex",
          )}
        >
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title}
              className={isCollapsed ? "mx-auto" : "mx-auto w-full px-2"}
            >
              {"sub" in item &&
              Array.isArray(item.sub) &&
              item.sub.length > 0 ? (
                <>
                  <SidebarMenuButton
                    asChild
                    variant={
                      pathname.trim().includes(item.url.trim())
                        ? "outline"
                        : "default"
                    }
                  >
                    <div className="flex">
                      <item.icon size={isCollapsed ? 20 : 24} />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {"sub" in item &&
                      item.sub.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              prefetch={true}
                              href={
                                type === "SUPER"
                                  ? subItem.url
                                  : `/${storeId}/${subItem.url}`
                              }
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
                </>
              ) : (
                <SidebarMenuButton
                  asChild
                  variant={
                    pathname.trim().includes(item.url.trim())
                      ? "outline"
                      : "default"
                  }
                >
                  <Link
                    href={
                      type === "SUPER" ? item.url : `/${storeId}/${item.url}`
                    }
                  >
                    <item.icon size={isCollapsed ? 20 : 24} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="my-2">
        <SidebarMenu className={isCollapsed ? "" : "px-2"}>
          <SidebarMenuItem
            className={cn("flex", isCollapsed ? "mx-auto" : "justify-start")}
          >
            <LogoutButton isCollapsed={isCollapsed} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
