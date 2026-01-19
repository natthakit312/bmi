"use client";

import { useState } from "react";
import { calculateBMI, classifyBMI, UnitSystem } from "@/lib/bmi";

export default function BmiCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [result, setResult] = useState<{ bmi: number; category: string; rangeText: string; color: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    
    const bmi = calculateBMI(w, h, unit);
    if (bmi !== null) {
      const classification = classifyBMI(bmi);
      setResult({
        bmi,
        ...classification
      });

      // Save to LocalStorage for Vercel Demo
      setLoading(true);
      try {
        const historyRaw = localStorage.getItem("bmi_history") || "[]";
        const history = JSON.parse(historyRaw);
        const newRecord = {
            id: Math.random().toString(36).substr(2, 9),
            weight: w,
            height: h,
            bmi,
            unitSystem: unit,
            category: classification.category,
            timestamp: new Date().toISOString()
        };
        history.unshift(newRecord);
        localStorage.setItem("bmi_history", JSON.stringify(history.slice(0, 100)));
        
        // Dispatch event for other components to refresh
        window.dispatchEvent(new Event("bmi-added"));
      } catch (err) {
        console.error("Failed to save log", err);
      } finally {
        setLoading(false);
      }
    } else {
      setResult(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">BMI Calculator</h2>
      
      <form onSubmit={handleCalculate} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Units</label>
          <select 
            value={unit} 
            onChange={(e) => setUnit(e.target.value as UnitSystem)}
            className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="metric">Metric (kg, cm)</option>
            <option value="imperial">Imperial (lb, in)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 relative">
            <label className="text-sm font-medium text-gray-600">Weight</label>
            <input 
              type="number" 
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "metric" ? "70" : "154"}
              className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 bottom-2 text-xs text-gray-400 pointer-events-none">
              {unit === "metric" ? "kg" : "lb"}
            </span>
          </div>
          <div className="flex flex-col gap-1 relative">
            <label className="text-sm font-medium text-gray-600">Height</label>
            <input 
              type="number" 
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === "metric" ? "170" : "67"}
              className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 bottom-2 text-xs text-gray-400 pointer-events-none">
              {unit === "metric" ? "cm" : "in"}
            </span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
        >
          Calculate BMI
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="text-center md:text-left flex-1">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Your BMI</p>
            <h3 className="text-4xl font-extrabold text-slate-900">{result.bmi.toFixed(1)}</h3>
          </div>
          <div className="flex-1">
            <p className={`text-lg font-bold ${result.color} mb-1`}>{result.category}</p>
            <p className="text-sm text-gray-500 leading-snug">{result.rangeText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
