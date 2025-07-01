import { Armchair, LayoutDashboard, Store, Users } from "lucide-react";

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
  {
    title: "Meja",
    url: "/super/meja",
    icon: Armchair,
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
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "CASHIER", label: "Cashier" },
];

export const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

export const storeStatusBadgeOptions = [
  {
    value: "ALL",
    label: "All",
    color: "#6B7280",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-800 dark:text-gray-200",
  },
  {
    value: "ACTIVE",
    label: "Active",
    color: "#10B981",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    color: "#EF4444",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-700 dark:text-red-300",
  },
];

export const genderBadgeOptions = [
  {
    value: "ALL",
    label: "All",
    color: "#6B7280",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-800 dark:text-gray-200",
  },
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
    value: "ALL",
    label: "All",
    color: "#6B7280",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-800 dark:text-gray-200",
  },
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

export const tableStatusBadgeOptions = [
  {
    value: "AVAILABLE",
    label: "Tersedia",
    color: "#10B981",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "WAITING_ORDER",
    label: "Menunggu Pesanan",
    color: "#3B82F6",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    value: "DINING",
    label: "Sedang Makan",
    color: "#8B5CF6",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  {
    value: "MAINTENANCE",
    label: "Maintenance",
    color: "#6B7280",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-800 dark:text-gray-200",
  },
];

export const tableStatusOptions = [
  { value: "AVAILABLE", label: "Tersedia" },
  { value: "WAITING_ORDER", label: "Menunggu Pesanan" },
  { value: "DINING", label: "Sedang Makan" },
  { value: "MAINTENANCE", label: "Maintenance" },
];
