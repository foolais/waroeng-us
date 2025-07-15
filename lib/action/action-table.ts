"use server";

import { auth } from "@/auth";
import { Prisma, TABLE_STATUS } from "@prisma/client";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { ITEM_PER_PAGE } from "../data";

interface ITable {
  name: string;
  storeId: string;
  status: TABLE_STATUS;
}

export const getAllTable = async (
  currentPage: number,
  search: string,
  status: "ALL" | TABLE_STATUS,
  store: string,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const pageSize = ITEM_PER_PAGE;

    const where: Prisma.TableWhereInput = {
      name: {
        contains: search,
        mode: "insensitive",
      },
      ...(status !== "ALL" && { status }),
      ...(store && { storeId: store }),
    };

    const [tables, count] = await prisma.$transaction([
      prisma.table.findMany({
        orderBy: { created_at: "desc" },
        take: pageSize,
        skip: pageSize * (currentPage - 1),
        where,
        select: {
          id: true,
          name: true,
          status: true,
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.table.count({ where }),
    ]);

    const data = tables.map((table, index) => ({
      no: (currentPage - 1) * pageSize + (index + 1),
      ...table,
    }));

    return { data, count };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const getTableById = async (id: string) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const table = await prisma.table.findFirst({
      where: { id },
    });

    if (!table) return { error: true, message: "Meja tidak ditemukan" };

    return table;
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const createTable = async (data: ITable) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const { name, storeId, status } = data;
    const table = await prisma.table.create({
      data: {
        name,
        storeId,
        status,
        createdById: session?.user.id,
      },
    });

    if (!table) return { error: true, message: "Meja gagal dibuat" };
    await prisma.history.create({
      data: {
        record_id: table.id,
        actions: `Meja ${table.name} telah dibuat`,
        table_name: "Meja",
        storeId: table.storeId,
        createdById: session?.user.id,
      },
    });

    revalidatePath(`/super/table`);
    return { success: true, message: "Meja berhasil dibuat" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const updateTable = async (id: string, data: ITable) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const { name, storeId, status } = data;

    const oldData = await prisma.table.findUnique({ where: { id } });

    if (!oldData) return { error: true, message: "Meja tidak ditemukan" };

    await prisma.$transaction([
      prisma.table.update({
        where: { id },
        data: {
          name,
          storeId,
          status,
          updatedById: session?.user.id,
        },
      }),
      prisma.history.create({
        data: {
          record_id: id,
          actions: `Meja ${oldData?.name} telah diubah`,
          table_name: "Table",
          storeId,
          createdById: session?.user.id,
        },
      }),
    ]);

    revalidatePath(`/super/table`);
    return { success: true, message: "Meja berhasil diubah" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};

export const deleteTable = async (id: string) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const oldData = await prisma.table.findUnique({ where: { id } });

    if (!oldData) return { error: true, message: "Meja tidak ditemukan" };

    await prisma.$transaction([
      prisma.table.delete({
        where: { id },
      }),
      prisma.history.create({
        data: {
          record_id: id,
          actions: `Meja ${oldData?.name} telah dihapus`,
          table_name: "Table",
          storeId: oldData?.storeId,
          createdById: session?.user.id,
        },
      }),
    ]);

    revalidatePath(`/super/table`);
    return { success: true, message: "Meja berhasil dihapus" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};
