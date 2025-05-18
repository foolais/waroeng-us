"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { CreateStoreSchema } from "../zod/zod-store";

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
