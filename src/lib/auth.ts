import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";
import { verifyPassword } from "./password";

/**
 * Auth.js (NextAuth v5), JWT sessions. The Credentials provider supports two
 * modes on one form:
 *   - password accounts (e.g. the seeded admin): email + password, verified.
 *   - passwordless dev accounts: email only — created/found on the fly.
 * GitHub/Google can be added later without schema changes.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Credentials({
      id: "dev",
      name: "Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      authorize: async (creds) => {
        const email = String(creds?.email ?? "").trim().toLowerCase();
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return null;
        const password = String(creds?.password ?? "");

        const existing = await prisma.user.findUnique({ where: { email } });

        // Password-protected account (e.g. the admin): require a valid password.
        if (existing?.passwordHash) {
          if (!verifyPassword(password, existing.passwordHash)) return null;
          return { id: existing.id, email: existing.email, name: existing.name, image: existing.image };
        }

        // Passwordless dev account: create/find on the fly.
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
