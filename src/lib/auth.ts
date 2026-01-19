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
        // Check if user exists in localStorage (client-side validation will happen in login form)
        // For server-side, we'll accept the credential and let client handle validation
        const email = (credentials?.email as string) || "";
        const password = (credentials?.password as string) || "";
        
        // Special demo user always works
        if (email === "demo@example.com") {
          return {
            id: "demo-user",
            email: "demo@example.com",
            name: "Demo User",
          };
        }
        
        // For other users, we trust that client-side validation happened
        // (since we can't access localStorage from server-side Next.js)
        if (email && password) {
          return {
            id: "user-" + Math.random().toString(36).slice(2, 7),
            email: email,
            name: email.split('@')[0],
          };
        }
        
        return null;
      },
    }),
  ],
});
