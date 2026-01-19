import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import BmiCalculator from "@/components/bmi-calculator";
import BmiHistory from "@/components/bmi-history";
import BmiReport from "@/components/bmi-report";
import MockGenerator from "@/components/mock-generator";
import DashboardWrapper from "@/components/dashboard-wrapper";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">BMI Pro</h1>
            <p className="text-slate-500 text-sm font-medium">Hello, {session.user?.name}</p>
          </div>
          <div className="flex gap-4">
             <Link 
              href="/api/auth/signout" 
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              Logout
            </Link>
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
          <p className="text-slate-400 text-xs font-medium">
            67162110273-3 ณัฐกิตติ์ แก้วบุญ
          </p>
        </footer>
      </div>
    </main>
  );
}
