"use server";

import { auth } from "@/auth";
import { orderType, paymentType } from "@/types/types";
import { prisma } from "../prisma";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { ORDER_STATUS, Prisma } from "@prisma/client";
import { ITEM_PER_PAGE } from "../data";

interface IOrder {
  orderType: orderType;
  paymentType: paymentType;
  tableId: string | null;
  notes: string | null;
  totalPrice: number;
  items: { id: string; quantity: number; price: number }[];
}

export const getAllOrder = async (
  currentPage: number,
  search: string,
  status: "ALL" | ORDER_STATUS,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const storeId = session.user.storeId;
  if (!storeId) return { error: true, message: "Toko tidak ditemukan" };

  try {
    const pageSize = ITEM_PER_PAGE;

    const where: Prisma.OrderWhereInput = {
      orderNumber: {
        contains: search,
        mode: "insensitive",
      },
      ...(status !== "ALL" && { status }),
    };

    const [orders, count] = await prisma.$transaction([
      prisma.order.findMany({
        orderBy: { created_at: "desc" },
        take: pageSize,
        skip: pageSize * (currentPage - 1),
        where,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          type: true,
          table: {
            select: {
              name: true,
            },
          },
          transaction: {
            select: {
              method: true,
            },
          },
          total: true,
          created_at: true,
          updated_at: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    const data = orders.map((order, index) => ({
      no: (currentPage - 1) * pageSize + index + 1,
      ...order,
    }));

    return { data, count };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const createOrder = async (data: IOrder) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const storeId = session.user.storeId;
  if (!storeId) return { error: true, message: "Toko tidak ditemukan" };

  try {
    // * [START] GENERATE ORDER NUMBER
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const countOrderToday = await prisma.order.count({
      where: { created_at: { gte: startOfToday } },
    });
    const orderNumberDate = moment().format("YYYYMMDD");
    const sequenceNumber = String(countOrderToday + 1).padStart(3, "0");

    const orderNumber = `WUS-${orderNumberDate}-${sequenceNumber}`;
    //* [END] GENERATE ORDER NUMBER

    //* [START] VALIDATE MENU ITEMS
    const menusId = data.items.map((item) => item.id);
    const menus = await prisma.menu.findMany({
      where: { id: { in: menusId }, storeId },
    });

    if (menus.length !== data.items.length) {
      const missingMenus = data.items.filter(
        (item) => !menus.some((menu) => menu.id === item.id),
      );
      return {
        error: true,
        message: `Menu dengan id ${missingMenus.map((item) => item.id)} tidak ditemukan`,
      };
    }

    const unavailableMenus = menus.filter(
      (menu) => menu.status !== "AVAILABLE",
    );
    if (unavailableMenus.length > 0)
      return {
        error: true,
        message: `Menu dengan id ${unavailableMenus.map((menu) => menu.id)} tidak tersedia`,
      };
    //* [END] VALIDATE MENU ITEMS

    // * [START] CREATE ORDER
    return await prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          status: "PENDING",
          type: data.orderType,
          orderNumber,
          notes: data.notes,
          total: data.totalPrice,
          tableId: data.tableId,
          storeId,
          createdById: session?.user.id,
          orderItems: {
            create: data.items.map((item) => ({
              menuId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          transaction: {
            create: { method: data.paymentType, amount: data.totalPrice },
          },
        },
      });

      if (data.orderType === "DINE_IN" && data.tableId) {
        await prisma.table.update({
          where: { id: data.tableId },
          data: { status: "WAITING_ORDER" },
        });
      }

      await prisma.history.create({
        data: {
          record_id: order.id,
          actions: `Pesanan ${order.orderNumber} telah dibuat`,
          table_name: "Order",
          storeId,
          createdById: session?.user.id,
        },
      });

      revalidatePath(`/${storeId}/pesanan`);
      return { success: true, message: "Pesanan berhasil dibuat" };
    });
    // * [END] CREATE ORDER
  } catch (error) {
    return { error: true, message: error };
  }
};
