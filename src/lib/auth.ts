import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";

/**
 * Auth.js (NextAuth v5). MVP uses a dev email login (no external provider) with
 * JWT sessions; GitHub/Google can be added to `providers` later without schema
 * changes (the Account/Session tables already exist).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Credentials({
      id: "dev",
      name: "Dev login",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      authorize: async (creds) => {
        const email = String(creds?.email ?? "").trim().toLowerCase();
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return null;
        const name = String(creds?.name ?? "").trim() || email.split("@")[0];
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name },
        });
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.uid = (user as { id: string }).id;
      return token;
    },
    session: ({ session, token }) => {
      if (token.uid && session.user) {
        (session.user as { id?: string }).id = token.uid as string;
      }
      return session;
    },
  },
  pages: { signIn: "/signin" },
});
