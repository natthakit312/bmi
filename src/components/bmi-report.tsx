"use client";

import { useEffect, useState } from "react";
import { BarChart3, CalendarRange } from "lucide-react";

type Period = "daily" | "weekly" | "monthly" | "yearly";

interface ReportItem {
  label: string;
  count: number;
  avgBmi: number;
  key: string;
  sumBmi: number;
}

export default function BmiReport() {
  const [period, setPeriod] = useState<Period>("daily");
  const [data, setData] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/report?period=${period}`);
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      }
    } catch (err) {
      console.error("Report fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    
    const refresh = () => fetchReport();
    window.addEventListener("bmi-added", refresh);
    return () => window.removeEventListener("bmi-added", refresh);
  }, [period]);

  const stats = {
    total: data.reduce((acc, curr) => acc + curr.count, 0),
    overallAvg: data.length > 0 
      ? (data.reduce((acc, curr) => acc + curr.sumBmi, 0) / data.reduce((acc, curr) => acc + curr.count, 0)).toFixed(1)
      : "0.0"
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            MIS Reports
          </h2>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(["daily", "weekly", "monthly", "yearly"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded-md transition-all ${
                  period === p ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-50">
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">Total Records</p>
            <p className="text-2xl font-black text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-50">
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mb-1">Avg BMI</p>
            <p className="text-2xl font-black text-indigo-900">{stats.overallAvg}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Period</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Count</th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Avg BMI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-400 text-sm">Updating report...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-400 text-sm">No historical data found</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.key} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-700 text-sm">{item.label}</td>
                  <td className="px-4 py-3 text-center text-slate-500 font-bold text-sm">{item.count}</td>
                  <td className="px-4 py-3 text-right font-black text-slate-900 text-sm">
                    {(item.sumBmi / item.count).toFixed(1)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
