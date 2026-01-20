"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import BmiCalculator from "@/components/bmi-calculator";
import BmiHistory from "@/components/bmi-history";
import BmiReport from "@/components/bmi-report";
import MockGenerator from "@/components/mock-generator";
import DashboardWrapper from "@/components/dashboard-wrapper";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authenticated user
    const storedUser = localStorage.getItem("bmi_currentUser");
    if (!storedUser) {
      router.push("/login");
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("bmi_currentUser");
        router.push("/login");
      }
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("bmi_currentUser");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">BMI Pro</h1>
            <p className="text-gray-400 text-sm font-medium">Track your health journey</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-300 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800 shadow-sm">
              <User className="w-4 h-4" />
              {user?.username}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-950/30 rounded-full transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex justify-center">
            <MockGenerator />
        </div>

        <DashboardWrapper 
            calculator={<BmiCalculator />} 
            history={<BmiHistory />} 
            report={<BmiReport />} 
        />

        <footer className="pt-8 pb-4 text-center">
          <p className="text-gray-400 text-xs font-medium">
            67162110273-3 ณัฐกิตติ์ แก้วบุญ
          </p>
        </footer>
      </div>
    </main>
  );
}
