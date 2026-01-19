export const authConfig = {
  // ใส่ค่าความลับลงไปตรงๆ เพื่อป้องกันปัญหาบน Vercel Production
  secret: "fixed_secret_for_demo_67162110273_nattakit_kaewbun",
  trustHost: true,
  pages: {
    signIn: "/login",
  },
};
