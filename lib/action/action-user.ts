"use server";

import { auth } from "@/auth";
import { UserSchema } from "../zod/zod-user";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { Gender, Role } from "@prisma/client";
import { hashSync } from "bcrypt-ts";

export const createUser = async (
  image: string,
  prevState: unknown,
  formData: FormData,
) => {
  const session = await auth();
  if (!session) return { error: { auth: ["You must be logged in"] } };

  const validatedFields = UserSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const data = validatedFields.data;
  const payload = {
    name: data.name,
    email: data.email,
    gender: data.gender as Gender,
    role: data.role as Role,
    phone: data.phone,
    address: data.address,
    storeId: data.storeId,
  };
  const hashedPassword = hashSync(data.password, 10);

  try {
    await prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
        image: image as string,
      },
    });

    revalidatePath(`/super/user`);
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error(error);
    return { error: { error: [error] } };
  }
};
