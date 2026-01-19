"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "th">("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Translations
  const t = {
    en: {
      title: "Welcome Back",
      subtitle: "Please enter your details to login",
      email: "Email",
      password: "Password (Optional for Demo)",
      signIn: "Sign In",
      signingIn: "Signing in...",
      or: "Or just use",
      demoBtn: "🚀 Login with Demo User",
      note: "Use any email to login",
      error: "Invalid email or password",
      errorGeneric: "An unexpected error occurred"
    },
    th: {
      title: "ยินดีต้อนรับกลับ",
      subtitle: "กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ",
      email: "อีเมล",
      password: "รหัสผ่าน (ไม่ต้องใส่ก็ได้)",
      signIn: "เข้าสู่ระบบ",
      signingIn: "กำลังเข้าสู่ระบบ...",
      or: "หรือ",
      demoBtn: "🚀 เข้าใช้งานด้วย Demo User",
      note: "ใช้ Email อะไรก็ได้เพื่อเข้าสู่ระบบ",
      error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      errorGeneric: "เกิดข้อผิดพลาดที่ไม่คาดคิด"
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Client-side validation: Check if user exists in localStorage
      if (email && email !== "demo@example.com") {
        const usersRaw = localStorage.getItem("registered_users") || "[]";
        const users = JSON.parse(usersRaw);
        const userExists = users.find((u: any) => u.email === email && u.password === password);
        
        if (!userExists) {
          setError(lang === "en" 
            ? "User not found. Please register first or use demo account." 
            : "ไม่พบผู้ใช้นี้ กรุณาลงทะเบียนก่อนหรือใช้บัญชี Demo");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email: email || "demo@example.com",
        password: password || "demo",
        redirect: false,
      });

      if (result?.error) {
        setError(t[lang].error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(t[lang].errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100 relative">
      <div className="absolute top-4 right-4 flex gap-1 bg-gray-100 p-1 rounded-lg">
         <button 
           onClick={() => setLang("en")}
           className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
         >
           EN
         </button>
         <button 
           onClick={() => setLang("th")}
           className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${lang === 'th' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
         >
           TH
         </button>
      </div>

      <div className="text-center mt-2">
        <h1 className="text-3xl font-bold text-gray-900">{t[lang].title}</h1>
        <p className="mt-2 text-sm text-gray-500">{t[lang].subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t[lang].email}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="demo@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t[lang].password}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70"
        >
          {loading ? t[lang].signingIn : t[lang].signIn}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">{t[lang].or}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            await signIn("credentials", { 
              email: "demo@example.com", 
              password: "demo",
              callbackUrl: "/" 
            });
          }}
          disabled={loading}
          className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {t[lang].demoBtn}
        </button>
      </form>

      <div className="text-center text-sm text-gray-500">
        <p className="mb-2">{t[lang].note}</p>
        <p>
          {lang === "en" ? "Don't have an account? " : "ยังไม่มีบัญชี? "}
          <Link href="/register" className="font-semibold text-blue-600 hover:underline">
            {lang === "en" ? "Register here" : "ลงทะเบียนที่นี่"}
          </Link>
        </p>
      </div>
    </div>
  );
}
