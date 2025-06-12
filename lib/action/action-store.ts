"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { StoreSchema } from "../zod/zod-store";
import { ITEM_PER_PAGE } from "../data";
import { Prisma, STORE_STATUS } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface IStore {
  name: string;
  status: STORE_STATUS;
}

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

  const validatedFields = StoreSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, status } = validatedFields.data;
  try {
    await prisma.store.create({
      data: {
        name,
        status: status as STORE_STATUS,
        createdById: session?.user.id,
      },
    });

    revalidatePath(`/super/store`);
    return { success: true, message: "Store created successfully" };
  } catch (error) {
    console.error(error);
    return { error: { error: [error] } };
  }
};

export const createStoreNew = async (data: IStore) => {
  const session = await auth();
  if (!session) return { error: { auth: ["You must be logged in"] } };

  const { name, status } = data;
  try {
    await prisma.store.create({
      data: {
        name,
        status: status as STORE_STATUS,
        createdById: session?.user.id,
      },
    });

    revalidatePath(`/super/store`);
    return { success: true, message: "Store created successfully" };
  } catch (error) {
    console.error(error);
    return { error: { error: [error] } };
  }
};

export const getStoreById = async (id: string) => {
  const session = await auth();
  if (!session) return { error: { auth: ["You must be logged in"] } };

  try {
    const store = await prisma.store.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        status: true,
        created_at: true,
        updated_at: true,
        createdById: true,
        updatedById: true,
      },
    });

    if (!store) return { error: { store: ["Store not found"] } };

    return store;
  } catch (error) {
    console.log({ error });
    return {
      error: { general: ["An error occurred while fetching the store"] },
    };
  }
};

export const updateStore = async (
  id: string,
  prevState: unknown,
  formData: FormData,
) => {
  const session = await auth();
  if (!session) return { error: { auth: ["You must be logged in"] } };

  const validatedFields = StoreSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, status } = validatedFields.data;

  try {
    await prisma.store.update({
      where: { id },
      data: {
        name,
        status: status as STORE_STATUS,
        updatedById: session?.user.id,
      },
    });

    revalidatePath(`/super/store`);
    return { success: true, message: "Store updated successfully" };
  } catch (error) {
    console.log({ error });
    return {
      error: { general: ["An error occurred while fetching the store"] },
    };
  }
};

export const updateStoreNew = async (id: string, data: IStore) => {
  const session = await auth();
  if (!session) return { error: { auth: ["You must be logged in"] } };

  const { name, status } = data;

  try {
    await prisma.store.update({
      where: { id },
      data: {
        name,
        status: status as STORE_STATUS,
        updatedById: session?.user.id,
      },
    });

    revalidatePath(`/super/store`);
    return { success: true, message: "Store updated successfully" };
  } catch (error) {
    console.log({ error });
    return {
      error: { general: ["An error occurred while fetching the store"] },
    };
  }
};

export const deleteStore = async (id: string) => {
  const session = await auth();
  if (!session) return { error: { auth: ["You must be logged in"] } };

  try {
    await prisma.store.delete({
      where: { id },
    });
    revalidatePath(`/super/store`);
    return { success: true, message: "Store deleted successfully" };
  } catch (error) {
    console.log({ error });
    return {
      error: { general: ["An error occurred while fetching the store"] },
    };
  }
};
