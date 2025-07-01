import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return moment(date).format("LL");
}

export function getButtonText(
  type: "CREATE" | "UPDATE" | "DETAIL",
  name: string,
  isPending: boolean,
) {
  if (isPending) {
    return type === "CREATE" ? "Membuat..." : "Mengubah...";
  }
  return type === "CREATE" ? `Buat ${name}` : `Ubah ${name}`;
}
