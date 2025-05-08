"use server";

import { signIn, signOut } from "@/auth";
import { LoginSchema, RegisterSchema } from "../zod/zod-auth";
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

export const loginCredentials = async (
  prevState: unknown,
  formData: FormData,
) => {
  const form = Object.fromEntries(formData.entries());

  const validatedFields = LoginSchema.safeParse(form);
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error(error);
    if (error instanceof AuthError) {
      switch (error.name) {
        case "CredentialsSignin":
          return { error: true, message: "Invalid email or password" };
        default:
          return { error: true, message: "Authentication failed" };
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
