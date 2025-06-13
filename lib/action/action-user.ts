"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { hashSync } from "bcrypt-ts";
import { ITEM_PER_PAGE } from "../data";
import { Prisma } from "@prisma/client";

interface IUser {
  image?: string;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  address?: string;
  phone?: string;
  role: "ADMIN" | "CASHIER";
  storeId: string;
  password: string;
  confirmPassword: string;
}

export const createUserNew = async (data: IUser) => {
  const session = await auth();
  if (!session) return { error: { auth: ["You must be logged in"] } };

  const {
    name,
    email,
    gender,
    address,
    phone,
    role,
    storeId,
    password,
    image,
  } = data;
  const payload = {
    name,
    email,
    gender,
    role,
    phone,
    address,
    storeId,
  };
  const hashedPassword = hashSync(password, 10);

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

export const getAllUser = async (
  currentPage: number,
  search: string,
  role: "ALL" | "ADMIN" | "CASHIER",
  store: string,
) => {
  const session = await auth();
  if (!session) return { error: { auth: ["You must be logged in"] } };

  const pageSize = ITEM_PER_PAGE;

  const where: Prisma.UserWhereInput = {
    name: {
      contains: search,
      mode: "insensitive",
    },
    ...(role !== "ALL" && role && { role: role as "ADMIN" | "CASHIER" }),
    ...(store && { storeId: store }),
  };

  try {
    const [users, count] = await prisma.$transaction([
      prisma.user.findMany({
        orderBy: { created_at: "desc" },
        take: pageSize,
        skip: pageSize * (currentPage - 1),
        where,
        select: {
          id: true,
          image: true,
          name: true,
          email: true,
          gender: true,
          store: {
            select: {
              id: true,
              name: true,
            },
          },
          role: true,
          created_at: true,
          updated_at: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const data = users.map((user, index) => ({
      no: (currentPage - 1) * pageSize + (index + 1),
      ...user,
    }));

    return { data, count };
  } catch (error) {
    return { error: true, message: error };
  }
};
