"use server";

import { auth } from "@/auth";
import { UserSchema } from "../zod/zod-user";

export const createUser = async (prevState: unknown, formData: FormData) => {
  const session = await auth();
  if (!session) return { error: { auth: ["You must be logged in"] } };

  const validatedFields = UserSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const data = validatedFields.data;

  console.log({ data });
};
