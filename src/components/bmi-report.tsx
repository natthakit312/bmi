"use client";

import { useEffect, useState } from "react";
import { BarChart3, CalendarRange } from "lucide-react";
import MockGenerator from "./mock-generator";

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
          // Use local date components to avoid UTC shift
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          key = `${year}-${month}-${day}`;
          label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } else if (period === "weekly") {
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          key = `${date.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
          label = `Week ${weekNum}, ${date.getFullYear()}`;
        } else if (period === "monthly") {
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          key = `${year}-${month}`;
          label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        } else if (period === "yearly") {
          key = `${date.getFullYear()}`;
          label = key;
        }

        if (!groups[key]) {
          groups[key] = { label, count: 0, sumBmi: 0, key };
        }
        groups[key].count++;
        groups[key].sumBmi += (Number(log.bmi) || 0);
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
    <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            MIS Reports
          </h2>
          <div className="flex bg-gray-800 p-1 rounded-lg">
            {(["daily", "weekly", "monthly", "yearly"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  period === p 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
            <p className="text-xs text-gray-400 font-medium">Total Records</p>
            <p className="text-2xl font-black text-gray-100 mt-1">{stats.total}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
            <p className="text-xs text-gray-400 font-medium">Overall Avg BMI</p>
            <p className="text-2xl font-black text-blue-500 mt-1">{stats.overallAvg}</p>
          </div>
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading data...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-sm">No data available for this period.</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800 text-gray-400 font-medium border-b border-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-2">Period</th>
                <th className="px-4 py-2 text-right">Count</th>
                <th className="px-4 py-2 text-right">Avg BMI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {data.map((item) => (
                <tr key={item.key} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-300">
                    <div className="flex items-center gap-2">
                      <CalendarRange className="w-3 h-3 text-gray-500" />
                      {item.label}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-400">{item.count}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-200">
                    {(item.sumBmi / item.count).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
