import {
  Armchair,
  LayoutDashboard,
  NotebookText,
  Store,
  Users,
  Utensils,
} from "lucide-react";

export const ITEM_PER_PAGE = 10;

export const superSidenavItems = [
  {
    title: "Dashboard",
    url: "/super/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Toko",
    url: "/super/toko",
    icon: Store,
  },
  {
    title: "Pengguna",
    url: "/super/pengguna",
    icon: Users,
  },
  {
    title: "Meja",
    url: "/super/meja",
    icon: Armchair,
  },
  {
    title: "Menu",
    icon: Utensils,
    url: "/super/menu",
    sub: [
      {
        title: "Daftar",
        url: "/super/menu",
      },
      { title: "Kategori", url: "/super/menu/kategori" },
    ],
  },
];

export const adminSidenavItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pengguna",
    url: "/admin/pengguna",
    icon: Users,
  },
  {
    title: "Meja",
    url: "/admin/meja",
    icon: Armchair,
  },
  {
    title: "Menu",
    icon: Utensils,
    url: "/admin/menu",
    sub: [
      {
        title: "Daftar",
        url: "/admin/menu",
      },
      { title: "Kategori", url: "/admin/menu/kategori" },
    ],
  },
];

export const cashierSidenavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Menu",
    url: "/menu",
    icon: Utensils,
  },
  {
    title: "Pesanan",
    url: "/pesanan",
    icon: NotebookText,
  },
];

export const storeStatusOptions = [
  {
    value: "ACTIVE",
    label: "Aktif",
  },
  {
    value: "INACTIVE",
    label: "Tidak Aktif",
  },
];

export const roleOptions = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "CASHIER", label: "Cashier" },
];

export const genderOptions = [
  { value: "MALE", label: "Laki-Laki" },
  { value: "FEMALE", label: "Perempuan" },
];

export const storeStatusBadgeOptions = [
  {
    value: "ALL",
    label: "Semua",
    color: "#6B7280",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-800 dark:text-gray-200",
  },
  {
    value: "ACTIVE",
    label: "Aktif",
    color: "#10B981",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "INACTIVE",
    label: "Tidak Aktif",
    color: "#EF4444",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-700 dark:text-red-300",
  },
];

export const genderBadgeOptions = [
  {
    value: "ALL",
    label: "Semua",
    color: "#6B7280",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-800 dark:text-gray-200",
  },
  {
    value: "MALE",
    label: "Laki-Laki",
    color: "#3B82F6",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    value: "FEMALE",
    label: "Perempuan",
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

export const menuStatusOption = [
  { value: "AVAILABLE", label: "Aktif" },
  { value: "UNAVAILABLE", label: "Tidak Aktif" },
];

export const menuStatusBadgeOptions = [
  {
    value: "AVAILABLE",
    label: "Aktif",
    color: "#10B981",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "UNAVAILABLE",
    label: "Tidak Aktif",
    color: "#EF4444",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-700 dark:text-red-300",
  },
];

export const orderTypeOptions = [
  { value: "DINE_IN", label: "Makan Di Tempat" },
  { value: "TAKE_AWAY", label: "Dibawa Pulang" },
];

export const paymentTypeOptions = [
  { value: "CASH", label: "Tunai" },
  { value: "QR", label: "Qris" },
];

export const orderStatusOptions = [
  { value: "PENDING", label: "Menunggu Pembayaran" },
  { value: "PAID", label: "Sudah Bayar" },
  { value: "CANCELED", label: "Dibatalkan" },
];

export const orderTypeBadgeOptions = [
  {
    value: "DINE_IN",
    label: "Makan Di Tempat",
    color: "#3B82F6",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    value: "TAKE_AWAY",
    label: "Dibawa Pulang",
    color: "#10B981",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
];

export const orderStatusBadgeOptions = [
  {
    value: "PENDING",
    label: "Menunggu Pembayaran",
    color: "#F59E0B",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-700 dark:text-amber-300",
  },
  {
    value: "PAID",
    label: "Sudah Bayar",
    color: "#10B981",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "CANCELED",
    label: "Dibatalkan",
    color: "#EF4444",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-700 dark:text-red-300",
  },
];
