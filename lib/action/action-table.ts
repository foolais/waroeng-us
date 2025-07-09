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
  if (!session) return { error: true, message: "You must be logged in" };

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

export const createTable = async (data: ITable) => {
  const session = await auth();
  if (!session) return { error: true, message: "You must be logged in" };

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

    if (!table) return { error: true, message: "Table not created" };
    await prisma.history.create({
      data: {
        record_id: table.id,
        actions: `Table ${table.name} created`,
        table_name: "Table",
        storeId: table.storeId,
        createdById: session?.user.id,
      },
    });

    revalidatePath(`/super/table`);
    return { success: true, message: "Table created successfully" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};
