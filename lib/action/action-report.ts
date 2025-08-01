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

function getDateRange(timeRange: TimeRange) {
  let from: Date;
  const to: Date = endOfDay(new Date());

  switch (timeRange) {
    case "today":
      from = startOfDay(new Date());
      break;
    case "3days":
      from = subDays(startOfDay(new Date()), 2);
      break;
    case "7days":
      from = subDays(startOfDay(new Date()), 6);
      break;
    case "15days":
      from = subDays(startOfDay(new Date()), 14);
      break;
    case "1month":
      from = subMonths(startOfDay(new Date()), 1);
      break;
    case "all":
      from = new Date(0);
      break;
    default:
      from = startOfDay(new Date());
  }

  return { from, to };
}

export const getOrderProcessReport = async (
  timeRange: TimeRange = "today",
  storeId?: string,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const userStoreId = session.user.storeId;
  if (!userStoreId && session.user.role !== "SUPER_ADMIN" && !storeId)
    return { error: true, message: "Toko tidak ditemukan" };

  try {
    const { from, to } = getDateRange(timeRange);
    const where: Prisma.OrderWhereInput = {
      storeId: userStoreId || storeId,
      created_at: {
        gte: from.toISOString(),
        lte: to.toISOString(),
      },
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
  timeRange: TimeRange = "today",
  storeId?: string,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const userStoreId = session.user.storeId;
  if (!userStoreId && session.user.role !== "SUPER_ADMIN")
    return { error: true, message: "Toko tidak ditemukan" };

  try {
    const { from, to } = getDateRange(timeRange);

    const where: Prisma.TransactionWhereInput = {
      order: { storeId: userStoreId || storeId },
      paidAt: {
        gte: from.toISOString(),
        lte: to.toISOString(),
      },
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
  timeRange: TimeRange = "today",
  storeId?: string,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const userStoreId = session.user.storeId;
  if (!userStoreId && session.user.role !== "SUPER_ADMIN")
    return { error: true, message: "Toko tidak ditemukan" };

  try {
    const { from, to } = getDateRange(timeRange);
    const where: Prisma.TransactionWhereInput = {
      order: { storeId: storeId || userStoreId },
      paidAt: {
        gte: from.toISOString(),
        lte: to.toISOString(),
      },
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

  const { from, to } = getDateRange(timeRange);
  let interval: "hour" | "day" | "month" =
    timeRange === "today" ? "hour" : "day";

  if (timeRange === "all") {
    interval = "month";
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
  interval: "hour" | "day" | "month",
  timeRange: TimeRange,
) {
  let groupedData: { period: string; revenue: number }[] = [];

  if (interval === "hour") {
    // Existing hour logic...
  } else if (interval === "month") {
    // Group by month for "all" time range
    const monthsMap = new Map<string, number>();

    // Initialize all months in range
    let current = new Date(from);
    while (current <= to) {
      const period = format(current, "yyyy-MM");
      monthsMap.set(period, 0);
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    // Add actual transaction data
    transactions.forEach((transaction) => {
      const period = format(new Date(transaction.paidAt), "yyyy-MM");
      monthsMap.set(period, (monthsMap.get(period) || 0) + transaction.amount);
    });

    groupedData = Array.from(monthsMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([period, revenue]) => ({
        period: format(new Date(`${period}-01`), "MMM yyyy"),
        revenue,
      }));
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

export const getOverviewStore = async (
  timeRange: TimeRange,
  storeId?: string,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const userStoreId = session.user.storeId;
  if (!userStoreId && session.user.role !== "SUPER_ADMIN" && !storeId)
    return { error: true, message: "Toko tidak ditemukan" };

  const { from, to } = getDateRange(timeRange);

  try {
    const [totalUser, totalTable, totalMenu, totalCategory] =
      await prisma.$transaction([
        prisma.user.count({
          where: {
            storeId: userStoreId || storeId,
            created_at: {
              gte: from.toISOString(),
              lte: to.toISOString(),
            },
          },
        }),
        prisma.table.count({
          where: {
            storeId: userStoreId || storeId,
            created_at: {
              gte: from.toISOString(),
              lte: to.toISOString(),
            },
          },
        }),
        prisma.menu.count({
          where: {
            storeId: userStoreId || storeId,
            created_at: {
              gte: from.toISOString(),
              lte: to.toISOString(),
            },
          },
        }),
        prisma.category.count({
          where: {
            storeId: userStoreId || storeId,
            created_at: {
              gte: from.toISOString(),
              lte: to.toISOString(),
            },
          },
        }),
      ]);

    return { totalUser, totalTable, totalMenu, totalCategory };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const getTotalStore = async (timeRange: TimeRange) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const { from, to } = getDateRange(timeRange);
  try {
    const totalStore = await prisma.store.count({
      where: {
        created_at: {
          gte: from.toISOString(),
          lte: to.toISOString(),
        },
      },
    });
    return { totalStore };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};
