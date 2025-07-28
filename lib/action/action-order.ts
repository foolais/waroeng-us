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
  dateFrom?: Date | string | null,
  dateTo?: Date | string | null,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const storeId = session.user.storeId;
  if (!storeId) return { error: true, message: "Toko tidak ditemukan" };

  try {
    const pageSize = ITEM_PER_PAGE;

    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const createdAtFilter: Record<string, string> = {};
    if (fromDate) createdAtFilter.gte = fromDate.toISOString();
    if (toDate) createdAtFilter.lte = toDate.toISOString();

    const where: Prisma.OrderWhereInput = {
      storeId,
      orderNumber: {
        contains: search,
        mode: "insensitive",
      },
      ...(status !== "ALL" && { status }),
      ...(Object.keys(createdAtFilter).length > 0 && {
        created_at: createdAtFilter,
      }),
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

export const getOrderById = async (orderId: string) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const storeId = session.user.storeId;
  if (!storeId) return { error: true, message: "Toko tidak ditemukan" };

  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        type: true,
        table: {
          select: {
            id: true,
            name: true,
          },
        },
        transaction: {
          select: {
            method: true,
          },
        },
        orderItems: {
          select: {
            menu: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            quantity: true,
            price: true,
          },
        },
        notes: true,
        total: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!order) return { error: true, message: "Order tidak ditemukan" };

    return order;
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

interface IUpdateOrder extends IOrder {
  status: ORDER_STATUS;
  orderNumber: string;
}

export const updateOrder = async (orderId: string, data: IUpdateOrder) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  const storeId = session.user.storeId;
  if (!storeId) return { error: true, message: "Toko tidak ditemukan" };

  try {
    return await prisma.$transaction(async (prisma) => {
      const oldData = await prisma.order.findUnique({
        where: { id: orderId },
        include: { table: true },
      });

      if (!oldData) {
        return { error: true, message: "Order tidak ditemukan" };
      }

      if (oldData.storeId !== storeId) {
        return { error: true, message: "Order tidak termasuk dalam toko ini" };
      }

      const { tableId, status, items } = data;
      const { tableId: oldTableId } = oldData;

      // * Validate menu items if they're being updated
      if (items && items.length > 0) {
        const menusId = items.map((item) => item.id);
        const menus = await prisma.menu.findMany({
          where: { id: { in: menusId }, storeId },
        });

        if (menus.length !== items.length) {
          const missingMenus = items.filter(
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
        if (unavailableMenus.length > 0) {
          return {
            error: true,
            message: `Menu dengan id ${unavailableMenus.map((menu) => menu.id)} tidak tersedia`,
          };
        }
      }

      // * Handle table status changes
      if (tableId) {
        const table = await prisma.table.findFirst({
          where: { id: tableId, storeId },
        });

        if (!table) {
          return { error: true, message: "Meja tidak ditemukan" };
        }

        if (tableId !== oldTableId && oldTableId) {
          // ? Free the old table
          await prisma.table.update({
            where: { id: oldTableId },
            data: { status: "AVAILABLE" },
          });
        }
        if (status !== "PENDING") {
          // ? Free the table if order is no longer pending
          await prisma.table.update({
            where: { id: tableId },
            data: { status: "AVAILABLE" },
          });
        } else if (status === "PENDING") {
          // ? Occupy the table if order is still pending
          await prisma.table.update({
            where: { id: tableId },
            data: { status: "WAITING_ORDER" },
          });
        }
      } else if (!tableId && oldTableId) {
        // ? Free the old table if order is being moved to no table
        await prisma.table.update({
          where: { id: oldTableId },
          data: { status: "AVAILABLE" },
        });
      }

      const payload = {
        status: data.status,
        type: data.orderType,
        notes: data.notes,
        total: data.totalPrice,
        tableId: data.tableId || null,
        updatedById: session.user.id,
      };

      // Update the order
      await prisma.order.update({
        where: { id: orderId },
        data: payload,
      });

      // Update order items if provided
      if (items && items.length > 0) {
        await prisma.orderItem.deleteMany({
          where: { orderId },
        });

        // Create new items
        await prisma.orderItem.createMany({
          data: items.map((item) => ({
            orderId,
            menuId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        });
      }

      // Update transaction if payment type changed
      if (data.paymentType) {
        await prisma.transaction.update({
          where: { orderId },
          data: {
            method: data.paymentType,
            amount: data.totalPrice,
          },
        });
      }

      await prisma.history.create({
        data: {
          record_id: orderId,
          actions: `Pesanan ${oldData.orderNumber} telah diubah`,
          table_name: "Order",
          storeId,
          createdById: session.user.id,
        },
      });

      revalidatePath(`/${storeId}/pesanan`);
      return {
        success: true,
        message: "Order berhasil diubah",
      };
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      error: true,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengupdate order",
    };
  }
};
