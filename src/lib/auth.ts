import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simple mock login: allow any email, default to demo
        const email = (credentials?.email as string) || "demo@example.com";
        return {
          id: "user-" + Math.random().toString(36).slice(2, 7),
          email: email,
          name: email.split('@')[0],
        };
      },
    }),
  ],
});
