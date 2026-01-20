"use client";

import { useState } from "react";
import { Database } from "lucide-react";

export default function MockGenerator() {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const now = Date.now();
      const oneDay = 86400000;
      
      const requests = [];
      for (let i = 0; i < 10; i++) { // Reduce to 10 for faster feedback
        const timeOffset = Math.floor(Math.random() * 30 * oneDay); // Last 30 days
        const height = Math.floor(Math.random() * (190 - 150 + 1)) + 150;
        const weight = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
        const hMeter = height / 100;
        const bmi = parseFloat((weight / (hMeter * hMeter)).toFixed(1));
        
        let category = "Normal";
        if (bmi < 18.5) category = "Underweight";
        else if (bmi < 25) category = "Normal";
        else if (bmi < 30) category = "Overweight";
        else category = "Obese";

        requests.push(fetch("/api/bmi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weight,
            height,
            bmi,
            category,
            unitSystem: "metric",
            timestamp: new Date(now - timeOffset).toISOString(),
          }),
        }));
      }

      await Promise.all(requests);
      window.dispatchEvent(new Event("bmi-added"));
      alert("Generated 10 mock records in the database!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate records");
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
