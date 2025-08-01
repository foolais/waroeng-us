import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { RateLimiterMemory } from "rate-limiter-flexible";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return moment(date).format("DD-MM-YYYY");
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

export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
}

export const isCuid = (value: string) => {
  return /^c[a-z0-9]{24,}$/i.test(value);
};

export const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
});

export const formatNumberInput = (value: string): string => {
  const numericValue = value.replace(/\D/g, "");

  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseFormattedNumber = (formattedValue: string): number => {
  return parseInt(formattedValue.replace(/\D/g, "")) || 0;
};
