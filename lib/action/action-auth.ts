"use server";

import { signIn, signOut } from "@/auth";
import { RegisterSchema } from "../zod/zod-auth";
import { AuthError } from "next-auth";
import { hashSync } from "bcrypt-ts";
import { prisma } from "../prisma";

export const registerCredentials = async (
  prevState: unknown,
  formData: FormData,
) => {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = hashSync(password, 10);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return {
      message: "Email is already taken.",
      error: { email: ["Email is already taken."] },
    };
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error(error);
    return { message: "Failed to create user" };
  }
};

export const loginCredentials = async (data: {
  email: string;
  password: string;
}) => {
  const { email, password } = data;
  const res = await prisma.user.findUnique({ where: { email } });

  if (!res)
    return {
      error: true,
      type: "credentials",
      message: "Autentikasi Gagal",
    };

  const { role, storeId } = res || {};

  let redirectUrl = "/";
  switch (role) {
    case "SUPER_ADMIN":
      redirectUrl = "/super/dashboard";
      break;
    case "ADMIN":
      redirectUrl = `/${storeId}/admin/dashboard`;
      break;
    case "CASHIER":
      redirectUrl = `/${storeId}/dashboard`;
      break;
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectUrl,
    });
    return { success: true, message: "Berhasil Login" };
  } catch (error) {
    console.error(error);
    if (error instanceof AuthError) {
      switch (error.name) {
        case "CredentialsSignin":
          return {
            error: true,
            type: "credentials",
            message: "Autentikasi Gagal",
          };
        default:
          return {
            error: true,
            type: "credentials",
            message: "Autentikasi Gagal",
          };
      }
    }
    throw error;
  }
};

export const logoutCredentials = async () => {
  try {
    await signOut();
  } catch (error) {
    console.log(error);
  }
};
