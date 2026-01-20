"use client";

import { useState } from "react";
import { Calculator, ScrollText, BarChart2 } from "lucide-react";

interface DashboardWrapperProps {
  calculator: React.ReactNode;
  history: React.ReactNode;
  report: React.ReactNode;
}

export default function DashboardWrapper({ calculator, history, report }: DashboardWrapperProps) {
  const [activeTab, setActiveTab] = useState<"calculator" | "report">("calculator");

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex bg-gray-800/50 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab("calculator")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
            activeTab === "calculator" 
              ? "bg-gray-700 text-white shadow-md scale-[1.02]" 
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Calculator className="w-5 h-5" />
          Calculator
        </button>
        <button
          onClick={() => setActiveTab("report")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
            activeTab === "report" 
              ? "bg-gray-700 text-white shadow-md scale-[1.02]" 
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          MIS Reports
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6 animate-in fade-in duration-500">
        {activeTab === "calculator" ? (
          <>
            {calculator}
            <div className="flex items-center gap-2 px-2 text-gray-400">
                <ScrollText className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Your History</span>
            </div>
            {history}
          </>
        ) : (
          report
        )}
      </div>
    </div>
  );
}
