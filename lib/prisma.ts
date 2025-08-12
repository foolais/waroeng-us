// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Pick correct database URL
const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.POSTGRES_PRISMA_URL
    : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("❌ No database URL found in environment variables.");
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
