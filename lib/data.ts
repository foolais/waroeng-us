import { LayoutDashboard, Store, Users } from "lucide-react";

export const superSidenavItems = [
  {
    title: "Dashboard",
    url: "/super/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Store",
    url: "/super/store",
    icon: Store,
  },
  {
    title: "User",
    url: "/super/user",
    icon: Users,
  },
];

export const adminSidenavItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User",
    url: "/admin/users",
    icon: Users,
  },
];

export const ITEM_PER_PAGE = 10;
