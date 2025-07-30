"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import {
  startOfDay,
  endOfDay,
  subDays,
  subMonths,
  eachDayOfInterval,
  format,
} from "date-fns";
import { TimeRange } from "@/types/types";

export const getOrderProcessReport = async (
  startDate: Date | string | null,
  endDate: Date | string | null,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const storeId = session.user.storeId;
  if (!storeId && session.user.role !== "SUPER_ADMIN")
    return { error: true, message: "Toko tidak ditemukan" };

  try {
    const fromDate = startDate ? new Date(startDate) : null;
    const toDate = endDate ? new Date(endDate) : null;
    const createdAtFilter: Record<string, string> = {};
    if (fromDate) createdAtFilter.gte = fromDate.toISOString();
    if (toDate) createdAtFilter.lte = toDate.toISOString();

    const where: Prisma.OrderWhereInput = {
      storeId,
      ...(Object.keys(createdAtFilter).length > 0 && {
        created_at: createdAtFilter,
      }),
    };

    const [total, pending, paid, cancel] = await prisma.$transaction([
      prisma.order.count({ where }),
      prisma.order.count({
        where: { ...where, status: "PENDING" },
      }),
      prisma.order.count({
        where: { ...where, status: "PAID" },
      }),
      prisma.order.count({
        where: { ...where, status: "CANCELED" },
      }),
    ]);

    return { total, pending, paid, cancel };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const getTotalTransactionReport = async (
  startDate: Date | string | null,
  endDate: Date | string | null,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const storeId = session.user.storeId;
  if (!storeId && session.user.role !== "SUPER_ADMIN")
    return { error: true, message: "Toko tidak ditemukan" };

  try {
    const fromDate = startDate ? new Date(startDate) : null;
    const toDate = endDate ? new Date(endDate) : null;
    const paidAtFilter: Record<string, string> = {};
    if (fromDate) paidAtFilter.gte = fromDate.toISOString();
    if (toDate) paidAtFilter.lte = toDate.toISOString();

    const where: Prisma.TransactionWhereInput = {
      order: { storeId },
      ...(Object.keys(paidAtFilter).length > 0 && { paidAt: paidAtFilter }),
    };

    const transactions = await prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
      _count: { id: true },
    });

    return transactions;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const getTransactionMethodReport = async (
  startDate: Date | string | null,
  endDate: Date | string | null,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const storeId = session.user.storeId;
  if (!storeId && session.user.role !== "SUPER_ADMIN")
    return { error: true, message: "Toko tidak ditemukan" };

  try {
    const fromDate = startDate ? new Date(startDate) : null;
    const toDate = endDate ? new Date(endDate) : null;
    const paidAtFilter: Record<string, string> = {};
    if (fromDate) paidAtFilter.gte = fromDate.toISOString();
    if (toDate) paidAtFilter.lte = toDate.toISOString();

    const where: Prisma.TransactionWhereInput = {
      order: { storeId },
      ...(Object.keys(paidAtFilter).length > 0 && { paidAt: paidAtFilter }),
    };

    const paymentData = await prisma.transaction.groupBy({
      by: ["method"],
      _count: { id: true },
      where,
    });

    return paymentData;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const getRevenueData = async (storeId: string, timeRange: TimeRange) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  if (!storeId) return { error: true, message: "Toko tidak ditemukan" };

  let from: Date;
  const to: Date = endOfDay(new Date());
  let interval: "hour" | "day";

  switch (timeRange) {
    case "today":
      from = startOfDay(new Date());
      interval = "hour";
      break;
    case "3days":
      from = subDays(startOfDay(new Date()), 2);
      interval = "day";
      break;
    case "7days":
      from = subDays(startOfDay(new Date()), 6);
      interval = "day";
      break;
    case "15days":
      from = subDays(startOfDay(new Date()), 14);
      interval = "day";
      break;
    case "1month":
      from = subMonths(startOfDay(new Date()), 1);
      interval = "day";
      break;
    default:
      from = startOfDay(new Date());
      interval = "hour";
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        order: {
          storeId,
        },
        paidAt: {
          gte: from.toISOString(),
          lte: to.toISOString(),
        },
      },
      select: {
        amount: true,
        paidAt: true,
      },
      orderBy: {
        paidAt: "asc",
      },
    });

    return processRevenueData(transactions, from, to, interval, timeRange);
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

function processRevenueData(
  transactions: { amount: number; paidAt: Date }[],
  from: Date,
  to: Date,
  interval: "hour" | "day",
  timeRange: TimeRange,
) {
  let groupedData: { period: string; revenue: number }[] = [];

  if (interval === "hour") {
    // Group by 3-hour intervals for today view
    const hoursMap = new Map<string, number>();

    // Initialize all 3-hour intervals
    for (let h = 0; h < 24; h += 3) {
      const period = `${h.toString().padStart(2, "0")}:00`;
      hoursMap.set(period, 0);
    }

    // Add actual transaction data
    transactions.forEach((transaction) => {
      const date = new Date(transaction.paidAt);
      const hour = Math.floor(date.getHours() / 3) * 3;
      const period = `${hour.toString().padStart(2, "0")}:00`;
      hoursMap.set(period, (hoursMap.get(period) || 0) + transaction.amount);
    });

    groupedData = Array.from(hoursMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([period, revenue]) => ({ period, revenue }));
  } else {
    // Group by day for multi-day views
    const daysMap = new Map<string, number>();

    // Initialize all days in range
    const days = eachDayOfInterval({ start: from, end: to });
    days.forEach((day) => {
      const period = format(day, "yyyy-MM-dd");
      daysMap.set(period, 0);
    });

    // Add actual transaction data
    transactions.forEach((transaction) => {
      const period = format(new Date(transaction.paidAt), "yyyy-MM-dd");
      daysMap.set(period, (daysMap.get(period) || 0) + transaction.amount);
    });

    // Convert to display format
    groupedData = Array.from(daysMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([period, revenue]) => ({
        period:
          timeRange === "1month"
            ? format(new Date(period), "MMM dd")
            : format(new Date(period), "MMM dd"),
        revenue,
      }));
  }

  return groupedData;
}
