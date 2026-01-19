import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Trigger redeploy after fixing prisma config issue */
  env: {
    AUTH_SECRET: "lucky_secret_key_fixed_67162110273_nattakit",
    NEXTAUTH_SECRET: "lucky_secret_key_fixed_67162110273_nattakit", // สำหรับเวอร์ชันเก่า
  }
};

export default nextConfig;
