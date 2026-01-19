import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// บังคับตั้งค่า Secret ให้ระบบเห็นตั้งแต่เริ่มรัน เพื่อแก้ปัญหาบน Vercel
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "lucky_secret_key_for_bmi_pro_67162110273_3_nattakit";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
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
  pages: {
    signIn: "/login",
  },
});
