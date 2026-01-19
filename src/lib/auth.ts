import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || "default_lucky_secret_key_12345",
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Simple demo login logic: any user can login for demo purposes
        // or you can hardcode a user here
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
  pages: {
    signIn: "/login",
  },
});
