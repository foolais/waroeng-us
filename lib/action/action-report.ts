"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

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
