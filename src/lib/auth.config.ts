export const authConfig = {
  secret: process.env.AUTH_SECRET || "lucky_secret_key_fixed_67162110273_nattakit",
  trustHost: true,
  pages: {
    signIn: "/login",
  },
};
