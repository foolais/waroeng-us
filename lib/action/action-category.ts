"use server";

import { auth } from "@/auth";
import { ITEM_PER_PAGE } from "../data";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

interface ICategory {
  name: string;
  storeId: string;
}

export const getAllCategory = async (
  currentPage: number,
  search: string,
  store: string,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const pageSize = ITEM_PER_PAGE;

    const where: Prisma.CategoryWhereInput = {
      name: {
        contains: search,
        mode: "insensitive",
      },
      ...(store && { storeId: store }),
    };

    const [categories, count] = await prisma.$transaction([
      prisma.category.findMany({
        orderBy: { created_at: "desc" },
        take: pageSize,
        skip: pageSize * (currentPage - 1),
        where,
        select: {
          id: true,
          name: true,
          store: {
            select: {
              id: true,
              name: true,
            },
          },
          created_at: true,
          updated_at: true,
        },
      }),
      prisma.category.count({ where }),
    ]);

    const data = categories.map((category, index) => ({
      no: (currentPage - 1) * pageSize + (index + 1),
      ...category,
    }));

    return { data, count };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const getCategoryById = async (id: string) => {
  console.log({ id });
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const category = prisma.category.findFirst({
      where: { id },
    });

    if (!category) return { error: true, message: "Kategori tidak ditemukan" };

    return category;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const createCategory = async (data: ICategory) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const { name, storeId } = data;
    const category = await prisma.category.create({
      data: {
        name,
        storeId,
        createdById: session?.user.id,
      },
    });
    if (!category) return { error: true, message: "Kategori gagal dibuat" };

    await prisma.history.create({
      data: {
        record_id: category.id,
        actions: `Kategori ${category.name} telah dibuat`,
        table_name: "Category",
        storeId: category.storeId,
        createdById: session?.user.id,
      },
    });

    revalidatePath(`/super/menu/kategori`);
    return { success: true, message: "Kategori berhasil dibuat" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const updateCategory = async (id: string, data: ICategory) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const { name, storeId } = data;

    const oldData = await prisma.category.findUnique({ where: { id } });
    if (!oldData) return { error: true, message: "Kategori tidak ditemukan" };

    await prisma.$transaction([
      prisma.category.update({
        where: { id },
        data: {
          name,
          storeId,
          updatedById: session?.user.id,
        },
      }),
      prisma.history.create({
        data: {
          record_id: id,
          actions: `Kategori ${oldData?.name} telah diubah`,
          table_name: "Category",
          storeId,
          createdById: session?.user.id,
        },
      }),
    ]);

    revalidatePath(`/super/menu/kategori`);
    return { success: true, message: "Kategori berhasil diubah" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const deleteCategory = async (id: string) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const oldData = await prisma.category.findUnique({ where: { id } });

    if (!oldData) return { error: true, message: "Kategori tidak ditemukan" };

    await prisma.$transaction([
      prisma.category.delete({
        where: { id },
      }),
      prisma.history.create({
        data: {
          record_id: id,
          actions: `Kategori ${oldData?.name} telah dihapus`,
          table_name: "Category",
          storeId: oldData?.storeId,
          createdById: session?.user.id,
        },
      }),
    ]);

    revalidatePath(`/super/menu/kategori`);
    return { success: true, message: "Kategori berhasil dihapus" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};
