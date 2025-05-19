import { LayoutDashboard, Store, Users } from "lucide-react";

export const ITEM_PER_PAGE = 10;

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

export const STORE_STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
];

export const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "CASHIER", label: "Cashier" },
];

export const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];
