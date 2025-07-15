"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { MENU_STATUS, Prisma } from "@prisma/client";
import { ITEM_PER_PAGE } from "../data";

interface IMenu {
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
  storeId: string,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const pageSize = ITEM_PER_PAGE;

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
