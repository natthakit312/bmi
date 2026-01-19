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
      const historyRaw = localStorage.getItem("bmi_history") || "[]";
      const logs = JSON.parse(historyRaw);
      
      const groups: Record<string, any> = {};

      logs.forEach((log: any) => {
        const date = new Date(log.timestamp);
        let key = "";
        let label = "";

        if (period === "daily") {
          key = date.toISOString().split("T")[0];
          label = new Date(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } else if (period === "weekly") {
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          key = `${date.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
          label = `Week ${weekNum}, ${date.getFullYear()}`;
        } else if (period === "monthly") {
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        } else if (period === "yearly") {
          key = `${date.getFullYear()}`;
          label = key;
        }

        if (!groups[key]) {
          groups[key] = { label, count: 0, sumBmi: 0, key };
        }
        groups[key].count++;
        groups[key].sumBmi += log.bmi;
      });

      const result = Object.values(groups).sort((a: any, b: any) => b.key.localeCompare(a.key));
      setData(result as any);
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

      <div className="p-4 border-b border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">BMI Trend Analysis</h3>
        
        {/* Simple CSS Bar Chart */}
        <div className="h-64 flex items-end gap-2 sm:gap-4 font-mono text-xs">
          {data.length === 0 ? (
             <div className="w-full h-full flex items-center justify-center text-gray-300">
               No data to display graph
             </div>
          ) : (
            data.map((item) => {
              // Calculate height percentage based on BMI (max 40 for scale)
              // Normal BMI is ~18-25. Let's say max scale is 35.
              const bmi = item.sumBmi / item.count;
              const heightPercent = Math.min((bmi / 35) * 100, 100);
              
              // Color based on BMI
              let barColor = "bg-slate-300";
              if (bmi < 18.5) barColor = "bg-blue-300";
              else if (bmi < 25) barColor = "bg-green-400";
              else if (bmi < 30) barColor = "bg-orange-300";
              else barColor = "bg-red-400";

              return (
                <div key={item.key} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
                   <div className="w-full flex-1 flex items-end bg-slate-50 rounded-t-lg relative overflow-hidden">
                      <div 
                        className={`w-full ${barColor} rounded-t-md transition-all duration-500 ease-out group-hover:opacity-80`}
                        style={{ height: `${heightPercent}%` }}
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            BMI: {bmi.toFixed(1)}
                         </div>
                      </div>
                   </div>
                   <div className="text-[10px] text-gray-400 truncate w-full text-center rotate-0">
                      {item.label}
                   </div>
                </div>
              );
            })
          )}
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
