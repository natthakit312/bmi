"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface BmiLog {
  id: string;
  bmi: number;
  weight: number;
  height: number;
  unitSystem: string;
  category: string;
  timestamp: string;
}

export default function BmiHistory() {
  const [logs, setLogs] = useState<BmiLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/bmi");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Listen for custom event to refresh when new record is added
    const refresh = () => fetchLogs();
    window.addEventListener("bmi-added", refresh);
    return () => window.removeEventListener("bmi-added", refresh);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    
    try {
      const res = await fetch(`/api/bmi/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      
      setLogs((prev) => prev.filter((log) => log.id !== id));
    } catch (err) {
      console.error("Failed to delete log", err);
      alert("Failed to delete record");
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading history...</div>;

  return (
    <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h2 className="font-bold text-white">Recent Records</h2>
        <span className="text-xs font-bold px-2 py-1 bg-gray-800 text-gray-400 rounded-full">
          {logs.length} Total
        </span>
      </div>
      
      <div className="max-height-[400px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            <p>No records found yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex justify-between items-center hover:bg-gray-800 transition-colors group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-white">{(log.bmi ?? 0).toFixed(1)}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-400 rounded-full font-semibold">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    {log.weight}{log.unitSystem === "metric" ? "kg" : "lb"} / {log.height}{log.unitSystem === "metric" ? "cm" : "in"}
                    {" • "}{new Date(log.timestamp).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(log.id)}
                  className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
