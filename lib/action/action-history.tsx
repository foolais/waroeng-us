"use server";

import { auth } from "@/auth";
import { ITEM_PER_PAGE } from "../data";
import { Prisma } from "@prisma/client";
import { isCuid } from "../utils";
import { prisma } from "../prisma";

export const getAllHistory = async (
  currentPage: number,
  search: string,
  storeId?: string,
  takeItem?: number,
) => {
  const session = await auth();
  if (!session) return { error: true, message: "Autentikasi gagal" };

  try {
    const pageSize = takeItem ? takeItem : ITEM_PER_PAGE;

    const where: Prisma.HistoryWhereInput = {
      ...(isCuid(search)
        ? {
            record_id: search,
          }
        : {
            actions: {
              contains: search,
              mode: "insensitive",
            },
          }),
      ...(storeId && { storeId }),
    };

    const [histories, count] = await prisma.$transaction([
      prisma.history.findMany({
        orderBy: { created_at: "desc" },
        take: pageSize,
        skip: pageSize * (currentPage - 1),
        where,
        select: {
          id: true,
          actions: true,
          record_id: true,
          store: { select: { name: true } },
          createdBy: { select: { name: true } },
          created_at: true,
        },
      }),
      prisma.history.count({ where }),
    ]);

    const data = histories.map((history, index) => ({
      no: (currentPage - 1) * pageSize + index + 1,
      ...history,
    }));

    return { data, count };
  } catch (error) {
    console.log(error);
    return { error: true, message: error };
  }
};
