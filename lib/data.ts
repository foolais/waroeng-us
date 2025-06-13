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

export const storeStatusOptions = [
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

export const genderBadgeOptions = [
  {
    value: "MALE",
    label: "Male",
    color: "#3B82F6",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    value: "FEMALE",
    label: "Female",
    color: "#EC4899",
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
  },
];

export const roleBadgeOptions = [
  {
    value: "SUPER_ADMIN",
    label: "Super Admin",
    color: "#9333EA",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  {
    value: "ADMIN",
    label: "Admin",
    color: "#10B981",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "CASHIER",
    label: "Cashier",
    color: "#2563EB",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-700 dark:text-blue-300",
  },
];
