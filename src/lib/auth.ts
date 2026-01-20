import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Fast Login Mode: Skip DB check for login
        // We just hash the username to create a consistent ID
        if (credentials?.username) {
            const name = credentials.username as string;
            return {
                id: `user-${name}`, // Consistent ID derived from username
                name: name,
            };
        }
        return null;
      },
    }),
  ],
});
