import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts";
import { LoginSchema } from "@/lib/zod/zod-auth";
import { prisma } from "@/lib/prisma";
import { type AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      store_id?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    role?: string;
    store?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validateFields = LoginSchema.safeParse(credentials);

        if (!validateFields.success) return null;

        const { email, password } = validateFields.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) throw new Error("User not found");

        const isMatchedPassword = compareSync(password, user.password);

        if (!isMatchedPassword) throw new Error("Invalid email or password");

        return { ...user, password: undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as AdapterUser & { role?: string }).role;
        token.store_id = (user as AdapterUser & { store_id?: string }).store_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
        session.user.store_id = token.store_id as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  secret: process.env.AUTH_SECRET,
});
