"use client";

import { useState } from "react";
import { Database } from "lucide-react";

export default function MockGenerator() {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bmi/mock", { method: "POST" });
      if (res.ok) {
        window.dispatchEvent(new Event("bmi-added"));
        alert("Generated 50 historical records successfully!");
      }
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
      className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-xs font-bold hover:bg-amber-100 transition-all disabled:opacity-50"
    >
      <Database className="w-3 h-3" />
      {loading ? "Generating..." : "Generate 50 Mock Records"}
    </button>
  );
}
