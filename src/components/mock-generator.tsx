"use client";

import { useState } from "react";
import { Database } from "lucide-react";

export default function MockGenerator() {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const historyRaw = localStorage.getItem("bmi_history") || "[]";
      const history = JSON.parse(historyRaw);
      
      const newEntries = [];
      const now = Date.now();
      const oneDay = 86400000;

      for (let i = 0; i < 50; i++) {
        const timeOffset = Math.floor(Math.random() * 365 * oneDay);
        const timestamp = new Date(now - timeOffset).toISOString();
        const height = Math.floor(Math.random() * (190 - 150 + 1)) + 150;
        const weight = Math.floor(Math.random() * (120 - 45 + 1)) + 45;
        const hMeter = height / 100;
        const bmi = parseFloat((weight / (hMeter * hMeter)).toFixed(1));
        
        let category = "Normal";
        if (bmi < 18.5) category = "Underweight";
        else if (bmi < 25) category = "Normal";
        else if (bmi < 30) category = "Overweight";
        else category = "Obese";

        newEntries.push({
          id: Math.random().toString(36).substr(2, 9),
          bmi,
          weight,
          height,
          unitSystem: "metric",
          category,
          timestamp,
        });
      }

      const updatedHistory = [...newEntries, ...history].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 100);

      localStorage.setItem("bmi_history", JSON.stringify(updatedHistory));
      window.dispatchEvent(new Event("bmi-added"));
      alert("Generated 50 historical records in local storage!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generate}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 bg-amber-900/30 text-amber-500 border border-amber-900/50 rounded-lg text-xs font-bold hover:bg-amber-900/50 transition-all disabled:opacity-50"
    >
      <Database className="w-3 h-3" />
      {loading ? "Generating..." : "Generate 50 Mock Records"}
    </button>
  );
}
