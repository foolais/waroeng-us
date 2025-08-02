"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { MENU_STATUS, Prisma } from "@prisma/client";
import { ITEM_PER_PAGE } from "../data";
import { del } from "@vercel/blob";

export interface IMenu {
  image?: string;
  name: string;
  price: string;
  status: "AVAILABLE" | "UNAVAILABLE";
  storeId: string;
  categoryId: string;
}

export const getAllMenu = async (
  currentPage: number,
  search: string,
  status: "ALL" | MENU_STATUS,
  store: string,
  itemPerPage?: number,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  // Validate same session n store payload
  const isAdmin = session.user.role === "ADMIN";
  const storeId = isAdmin ? session.user.storeId : store;

  try {
    const pageSize = itemPerPage ? itemPerPage : ITEM_PER_PAGE;

    const where: Prisma.MenuWhereInput = {
      name: {
        contains: search,
        mode: "insensitive",
      },
      ...(status !== "ALL" && { status }),
      ...(storeId && { storeId }),
    };

    const [menus, count] = await prisma.$transaction([
      prisma.menu.findMany({
        orderBy: { created_at: "desc" },
        take: pageSize,
        skip: pageSize * (currentPage - 1),
        where,
        select: {
          id: true,
          image: true,
          name: true,
          price: true,
          status: true,
          store: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          created_at: true,
          updated_at: true,
        },
      }),
      prisma.menu.count({ where }),
    ]);

    const data = menus.map((menu, index) => ({
      no: (currentPage - 1) * pageSize + index + 1,
      ...menu,
    }));

    return { data, count };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const getMenuById = async (id: string) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const menu = await prisma.menu.findFirst({
      where: { id },
    });
    if (!menu) return { error: true, message: "Menu tidak ditemukan" };

    return menu;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const createMenu = async (data: IMenu) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  // Validate same session n store payload
  const isAdmin = session.user.role === "ADMIN";
  if (isAdmin) {
    const isSameStore = session.user.storeId === data.storeId;
    if (!isSameStore) return { error: true, message: "Store ID tidak sama" };
  }

  try {
    const payload = {
      image: data.image,
      name: data.name,
      price: +data.price,
      status: data.status,
      storeId: data.storeId,
      categoryId: data.categoryId,
      createdById: session?.user.id,
    };

    const menu = await prisma.menu.create({ data: payload });
    if (!menu) return { error: true, message: "Menu gagal dibuat" };

    await prisma.history.create({
      data: {
        record_id: menu.id,
        actions: `Menu ${menu.name} telah dibuat`,
        table_name: "Menu",
        storeId: menu.storeId,
        createdById: session?.user.id,
      },
    });

    revalidatePath(`/super/menu`);
    return { success: true, message: "Menu berhasil dibuat" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const updateMenu = async (id: string, data: IMenu) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  // Validate same session n store payload
  const isAdmin = session.user.role === "ADMIN";
  if (isAdmin) {
    const isSameStore = session.user.storeId === data.storeId;
    if (!isSameStore) return { error: true, message: "Store ID tidak sama" };
  }

  try {
    const payload = {
      image: data.image,
      name: data.name,
      price: +data.price,
      status: data.status,
      storeId: data.storeId,
      categoryId: data.categoryId,
      updatedById: session?.user.id,
    };

    const oldData = await prisma.menu.findUnique({ where: { id } });
    if (!oldData) return { error: true, message: "Menu tidak ditemukan" };

    await prisma.$transaction([
      prisma.menu.update({
        where: { id },
        data: payload,
      }),
      prisma.history.create({
        data: {
          record_id: id,
          actions: `Menu ${oldData?.name} telah diubah`,
          table_name: "Menu",
          storeId: oldData?.storeId,
          createdById: session?.user.id,
        },
      }),
    ]);

    revalidatePath(`/super/menu`);
    return { success: true, message: "Menu berhasil diubah" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const deleteMenu = async (id: string) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const oldData = await prisma.menu.findUnique({ where: { id } });
    if (!oldData) return { error: true, message: "Menu tidak ditemukan" };

    await prisma.$transaction([
      prisma.menu.delete({
        where: { id },
      }),
      prisma.history.create({
        data: {
          record_id: id,
          actions: `Menu ${oldData?.name} telah dihapus`,
          table_name: "Menu",
          storeId: oldData?.storeId,
          createdById: session?.user.id,
        },
      }),
    ]);

    if (oldData.image) {
      await del(oldData.image);
    }

    revalidatePath(`/super/menu`);
    return { success: true, message: "Menu berhasil dihapus" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};
