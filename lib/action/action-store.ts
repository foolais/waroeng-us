"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { CreateStoreSchema } from "../zod/zod-store";
import { ITEM_PER_PAGE } from "../data";
import { Prisma, STORE_STATUS } from "@prisma/client";

export const getAllStore = async (
  currentPage: number,
  search: string,
  status: "ALL" | STORE_STATUS,
) => {
  const session = await auth();
  if (!session) return { error: { auth: ["You must be logged in"] } };

  const pageSize = ITEM_PER_PAGE;

  const where: Prisma.StoreWhereInput = {
    name: {
      contains: search,
      mode: "insensitive",
    },
    ...(status !== "ALL" && { status }),
  };

  const [stores, count] = await prisma.$transaction([
    prisma.store.findMany({
      orderBy: { created_at: "desc" },
      take: pageSize,
      skip: pageSize * (currentPage - 1),
      where,
      select: {
        id: true,
        name: true,
        status: true,
        created_at: true,
        updated_at: true,
        createdById: true,
        updatedById: true,
      },
    }),
    prisma.store.count({ where }),
  ]);

  const data = stores.map((store, index) => ({
    no: (currentPage - 1) * pageSize + (index + 1),
    ...store,
  }));

  return { data, count };
};

export const createStore = async (prevState: unknown, formData: FormData) => {
  const session = await auth();
  if (!session) return { error: { auth: ["You must be logged in"] } };

  const validatedFields = CreateStoreSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name } = validatedFields.data;
  try {
    await prisma.store.create({
      data: {
        name,
        createdById: session?.user.id,
      },
    });

    return { success: true, message: "Store created successfully" };
  } catch (error) {
    console.error(error);
    return { error: { error: [error] } };
  }
};
