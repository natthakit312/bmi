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
        if (credentials?.email && credentials?.password) {
          return {
            id: "user-1",
            email: credentials.email as string,
            name: (credentials.email as string).split('@')[0],
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = 
        !nextUrl.pathname.startsWith('/login') && 
        !nextUrl.pathname.startsWith('/register') &&
        nextUrl.pathname !== '/';
      
      const isRoot = nextUrl.pathname === '/';

      if (isOnDashboard || isRoot) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },
  },
});
